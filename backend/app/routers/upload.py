import os
import time
from email.utils import parsedate_to_datetime
from typing import Optional
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
import cloudinary
import cloudinary.uploader

from app.config import settings
from app.dependencies.auth import get_current_seller
from app.models.user import User
from app.utils.rate_limiter import rate_limiter

router = APIRouter()

# Global clock offset against Cloudinary's servers to prevent stale request errors
_clock_offset: Optional[float] = None


def get_synced_timestamp() -> int:
    """Returns a UTC timestamp synchronized with Cloudinary server time."""
    global _clock_offset
    if _clock_offset is not None:
        return int(time.time() + _clock_offset)
    try:
        with httpx.Client(timeout=3.0) as client:
            res = client.head("https://api.cloudinary.com")
            date_str = res.headers.get("Date")
            if date_str:
                real_time = parsedate_to_datetime(date_str).timestamp()
                _clock_offset = real_time - time.time()
                return int(real_time)
    except Exception:
        pass
    return int(time.time())


# Configure Cloudinary credentials from settings
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}

EXTENSION_FORMAT_MAP = {
    ".jpg": "jpeg",
    ".jpeg": "jpeg",
    ".png": "png",
    ".webp": "webp",
}

MIME_FORMAT_MAP = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
CHUNK_SIZE = 64 * 1024  # 64KB

ALLOWED_FOLDERS = {
    "products": "products",
    "logos": "logos",
    "banners": "banners",
    "merchant_bazaar/products": "products",
    "merchant_bazaar/logos": "logos",
    "merchant_bazaar/banners": "banners",
    "merchant_bazaar": "uploads",
    "": "uploads",
}


def detect_image_format(header: bytes) -> Optional[str]:
    """Detects format from magic bytes for JPEG, PNG, and WebP."""
    if len(header) >= 3 and header.startswith(b"\xff\xd8\xff"):
        return "jpeg"
    if len(header) >= 8 and header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if len(header) >= 12 and header.startswith(b"RIFF") and header[8:12] == b"WEBP":
        return "webp"
    return None


@router.post("/image", summary="Upload an image to Cloudinary")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = "merchant_bazaar",
    current_seller: User = Depends(get_current_seller)
):
    """
    Accepts an authenticated image upload, validates its extension, MIME type,
    magic byte signature, size (max 5MB), and rate limit, then uploads directly
    to Cloudinary under the seller's secure isolated directory.
    """
    # 1. Upload Rate Limiting (10 uploads per minute per authenticated user)
    rate_limiter.check_rate_limit(
        key=f"upload_seller:{current_seller.id}",
        max_requests=10,
        window_seconds=60,
        error_message="Upload rate limit exceeded. You can only upload up to 10 images per minute."
    )

    # 2. Cloudinary Folder Restriction
    clean_folder = folder.strip().strip("/") if folder else ""
    if clean_folder not in ALLOWED_FOLDERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unauthorized upload folder specified."
        )
    subfolder = ALLOWED_FOLDERS[clean_folder]
    secure_folder = f"merchant_bazaar/{current_seller.id}/{subfolder}"

    # 3. File Extension Validation
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file extension. Allowed extensions are: .jpg, .jpeg, .png, .webp."
        )

    # 4. MIME Type Validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported content type. Allowed MIME types are: image/jpeg, image/png, image/webp."
        )

    # 5. File Size & Magic Bytes Validation (Streaming to avoid high memory usage)
    content_chunks = []
    total_size = 0

    first_chunk = await file.read(CHUNK_SIZE)
    if not first_chunk:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    detected_format = detect_image_format(first_chunk)
    if not detected_format:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unsupported image file. Content does not match supported image signatures."
        )

    if detected_format != EXTENSION_FORMAT_MAP.get(ext):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' does not match detected image format '{detected_format}'."
        )

    if detected_format != MIME_FORMAT_MAP.get(file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Content-Type '{file.content_type}' does not match detected image format '{detected_format}'."
        )

    content_chunks.append(first_chunk)
    total_size += len(first_chunk)

    while chunk := await file.read(CHUNK_SIZE):
        total_size += len(chunk)
        if total_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                detail="File size exceeds maximum allowed 5MB limit."
            )
        content_chunks.append(chunk)

    content = b"".join(content_chunks)

    # 6. Upload to Cloudinary with accurate server-synchronized timestamp
    try:
        result = cloudinary.uploader.upload(
            content,
            folder=secure_folder,
            resource_type="image",
            quality="auto",
            fetch_format="auto",
            timestamp=get_synced_timestamp()
        )

        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "bytes": result.get("bytes")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary upload failed: {str(e)}"
        )

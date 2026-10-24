import time
from email.utils import parsedate_to_datetime
from typing import Optional
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException, status
import cloudinary
import cloudinary.uploader
from app.config import settings

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

ALLOWED_EXTENSIONS = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/image", summary="Upload an image to Cloudinary")
async def upload_image(file: UploadFile = File(...), folder: str = "merchant_bazaar"):
    """
    Accepts an image file, uploads it directly to Cloudinary,
    and returns the permanent secure HTTPS URL.
    """
    if file.content_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload JPG, PNG, WEBP, or GIF."
        )

    try:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds maximum allowed 10MB limit."
            )

        # Upload to Cloudinary with accurate server-synchronized timestamp
        result = cloudinary.uploader.upload(
            content,
            folder=folder,
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

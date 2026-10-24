import hmac
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.models.store import Store, StoreStatus
from app.models.store_settings import StoreSettings
from app.config import settings
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.rate_limiter import rate_limiter
from app.schemas.auth import (
    SellerRegisterRequest,
    SellerLoginRequest,
    AdminLoginRequest,
    AuthTokenResponse,
    UserSummary,
    StoreSummary,
)
from app.dependencies.auth import get_token_payload

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new seller and initialize their store"
)
def register_seller(
    req: SellerRegisterRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    # Enforce IP-based rate limiting on registration (max 6 registrations per minute per IP)
    client_ip = rate_limiter.get_client_ip(request)
    rate_limiter.check_rate_limit(
        key=f"register:{client_ip}",
        max_requests=6,
        window_seconds=60,
        error_message="Too many store registrations from this network. Please wait a minute before trying again."
    )

    # 1. Check if email already in use
    existing_user = db.scalar(select(User).where(User.email == req.email.lower()))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A merchant account with this email address already exists"
        )

    # 2. Check if store slug already taken
    existing_slug = db.scalar(select(Store).where(Store.slug == req.store_slug.lower()))
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The subdomain slug '{req.store_slug.lower()}' is already taken. Please choose another."
        )

    # 3. Create User record
    new_user = User(
        name=req.name.strip(),
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        is_active=True,
    )
    db.add(new_user)
    db.flush()  # Populates new_user.id for FK

    # 4. Create Store record (1 store per seller strictly enforced)
    new_store = Store(
        seller_id=new_user.id,
        name=req.store_name.strip(),
        slug=req.store_slug.lower().strip(),
        status=StoreStatus.DRAFT,
    )
    db.add(new_store)
    db.flush()  # Populates new_store.id for FK

    # 5. Create StoreSettings record with brand defaults
    new_settings = StoreSettings(
        store_id=new_store.id,
        primary_color="#1a5c38",
        hero_heading=f"Welcome to {new_store.name}",
        hero_description="Explore our handpicked collection of premium products.",
        promotional_text="Free shipping on all launch orders!",
        hero_images=[],
    )
    db.add(new_settings)

    db.commit()
    db.refresh(new_user)
    db.refresh(new_store)

    # 6. Generate JWT token
    token = create_access_token(
        data={
            "sub": str(new_user.id),
            "role": "seller",
            "email": new_user.email,
        }
    )

    store_summary = StoreSummary(
        id=str(new_store.id),
        name=new_store.name,
        slug=new_store.slug,
        status=new_store.status.value,
    )

    user_summary = UserSummary(
        id=str(new_user.id),
        name=new_user.name,
        email=new_user.email,
        is_active=new_user.is_active,
        store=store_summary,
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        role="seller",
        user=user_summary,
    )


@router.post(
    "/login",
    response_model=AuthTokenResponse,
    summary="Unified login for Sellers and Super Admin"
)
def login_user(
    req: SellerLoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    clean_email = req.email.lower().strip()

    # Rate limiting: 10 attempts per minute per IP & 5 failed attempts per email
    rate_limiter.check_auth_attempt(request, clean_email)

    # 1. Check if matching Super Admin credentials from .env
    email_matches_admin = hmac.compare_digest(clean_email, settings.ADMIN_EMAIL.lower().strip())
    password_matches_admin = hmac.compare_digest(req.password, settings.ADMIN_PASSWORD)

    if email_matches_admin and password_matches_admin:
        rate_limiter.record_successful_login(clean_email)
        token = create_access_token(
            data={
                "sub": "admin",
                "role": "admin",
                "email": settings.ADMIN_EMAIL,
            }
        )
        admin_summary = UserSummary(
            id="admin",
            name="Super Administrator",
            email=settings.ADMIN_EMAIL,
            is_active=True,
            store=None,
        )
        return AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            role="admin",
            user=admin_summary,
        )

    # 2. Otherwise check registered Sellers in database
    user = db.scalar(select(User).where(User.email == clean_email))
    if not user or not verify_password(req.password, user.hashed_password):
        rate_limiter.record_failed_attempt(clean_email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your merchant account has been deactivated. Please contact support."
        )

    rate_limiter.record_successful_login(clean_email)
    token = create_access_token(
        data={
            "sub": str(user.id),
            "role": "seller",
            "email": user.email,
        }
    )

    store_summary = None
    if user.store:
        store_summary = StoreSummary(
            id=str(user.store.id),
            name=user.store.name,
            slug=user.store.slug,
            status=user.store.status.value,
        )

    user_summary = UserSummary(
        id=str(user.id),
        name=user.name,
        email=user.email,
        is_active=user.is_active,
        store=store_summary,
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        role="seller",
        user=user_summary,
    )


@router.post(
    "/admin/login",
    response_model=AuthTokenResponse,
    summary="Authenticate platform Super Admin"
)
def login_super_admin(
    req: AdminLoginRequest,
    request: Request
):
    clean_email = req.email.lower().strip()
    rate_limiter.check_auth_attempt(request, clean_email)

    # Constant-time comparison for admin credentials
    email_matches = hmac.compare_digest(clean_email, settings.ADMIN_EMAIL.lower().strip())
    password_matches = hmac.compare_digest(req.password, settings.ADMIN_PASSWORD)

    if not (email_matches and password_matches):
        rate_limiter.record_failed_attempt(clean_email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials"
        )

    rate_limiter.record_successful_login(clean_email)
    token = create_access_token(
        data={
            "sub": "admin",
            "role": "admin",
            "email": settings.ADMIN_EMAIL,
        }
    )

    admin_summary = UserSummary(
        id="admin",
        name="Super Administrator",
        email=settings.ADMIN_EMAIL,
        is_active=True,
        store=None,
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        role="admin",
        user=admin_summary,
    )


@router.get(
    "/me",
    response_model=UserSummary,
    summary="Retrieve profile of current authenticated user"
)
def get_current_profile(
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
):
    role = payload.get("role")
    if role == "admin":
        return UserSummary(
            id="admin",
            name="Super Administrator",
            email=settings.ADMIN_EMAIL,
            is_active=True,
            store=None,
        )

    user_id = payload.get("sub")
    import uuid
    try:
        user_uuid = uuid.UUID(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token payload"
        )

    user = db.scalar(select(User).where(User.id == user_uuid))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found"
        )

    store_summary = None
    if user.store:
        store_summary = StoreSummary(
            id=str(user.store.id),
            name=user.store.name,
            slug=user.store.slug,
            status=user.store.status.value,
        )

    return UserSummary(
        id=str(user.id),
        name=user.name,
        email=user.email,
        is_active=user.is_active,
        store=store_summary,
    )

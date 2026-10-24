from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import select
import uuid

from app.database import get_db
from app.models.user import User
from app.config import settings
from app.utils.security import decode_access_token

security_scheme = HTTPBearer(auto_error=False)


def get_token_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Dict[str, Any]:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def get_current_seller(
    payload: Dict[str, Any] = Depends(get_token_payload),
    db: Session = Depends(get_db)
) -> User:
    role = payload.get("role")
    user_id = payload.get("sub")

    if role != "seller" or not user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Seller privileges required"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user identifier in token"
        )

    user = db.scalar(select(User).where(User.id == user_uuid))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant account not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your merchant account has been deactivated. Please contact support."
        )

    return user


def get_current_admin(
    payload: Dict[str, Any] = Depends(get_token_payload)
) -> Dict[str, str]:
    role = payload.get("role")
    email = payload.get("email")

    if role != "admin" or email != settings.ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Super Admin credentials required"
        )

    return {"email": settings.ADMIN_EMAIL, "role": "admin"}

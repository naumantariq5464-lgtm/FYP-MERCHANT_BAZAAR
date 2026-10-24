import re
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class SellerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    store_name: str = Field(..., min_length=2, max_length=100)
    store_slug: str = Field(..., min_length=2, max_length=50)

    @field_validator("store_slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", clean):
            raise ValueError(
                "Store slug must contain only lowercase letters, numbers, and hyphens (no leading or trailing hyphens)"
            )
        reserved = ["admin", "api", "dashboard", "www", "app", "mail", "auth", "storefront"]
        if clean in reserved:
            raise ValueError(f"'{clean}' is a reserved subdomain slug and cannot be used")
        return clean


class SellerLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class StoreSummary(BaseModel):
    id: str
    name: str
    slug: str
    status: str

    class Config:
        from_attributes = True


class UserSummary(BaseModel):
    id: str
    name: str
    email: str
    is_active: bool
    store: Optional[StoreSummary] = None

    class Config:
        from_attributes = True


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str  # "seller" | "admin"
    user: UserSummary

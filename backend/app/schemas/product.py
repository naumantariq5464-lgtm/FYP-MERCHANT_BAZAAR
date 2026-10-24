from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, Field


# ── Variant Schemas ─────────────────────────────────────────────
class VariantBase(BaseModel):
    variant_type: str = Field(..., max_length=50, description="e.g. size, color")
    variant_value: str = Field(..., max_length=50, description="e.g. XL, Red")
    extra_price: Decimal = Field(default=Decimal("0.00"), ge=0)
    stock_qty: int = Field(default=0, ge=0)


class VariantCreate(VariantBase):
    pass


class VariantResponse(VariantBase):
    id: UUID
    product_id: UUID

    class Config:
        from_attributes = True


# ── Image Schemas ───────────────────────────────────────────────
class ProductImageCreate(BaseModel):
    image_url: str
    display_order: int = 0


class ProductImageResponse(BaseModel):
    id: UUID
    product_id: UUID
    image_url: str
    display_order: int

    class Config:
        from_attributes = True


# ── Product Schemas ─────────────────────────────────────────────
class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    category_id: Optional[UUID] = None
    status: str = Field(default="active", pattern="^(active|inactive)$")


class ProductCreate(ProductBase):
    images: List[str] = Field(default_factory=list, description="List of image URLs")
    variants: List[VariantCreate] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    category_id: Optional[UUID] = None
    status: Optional[str] = Field(None, pattern="^(active|inactive)$")
    images: Optional[List[str]] = None
    variants: Optional[List[VariantCreate]] = None


class ProductResponse(ProductBase):
    id: UUID
    store_id: UUID
    created_at: datetime
    updated_at: datetime
    category_name: Optional[str] = None
    images: List[ProductImageResponse] = Field(default_factory=list)
    variants: List[VariantResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True

from typing import List, Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field


# ── Order Item Schemas ──────────────────────────────────────────
class OrderItemCreate(BaseModel):
    product_id: UUID
    variant_id: Optional[UUID] = None
    quantity: int = Field(..., gt=0, description="Quantity must be at least 1")


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: Optional[UUID] = None
    variant_id: Optional[UUID] = None
    product_name: str
    variant_info: Optional[str] = None
    unit_price: Decimal
    quantity: int

    class Config:
        from_attributes = True


# ── Order Schemas ───────────────────────────────────────────────
class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=150)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=7, max_length=30)
    delivery_address: str = Field(..., min_length=5)
    items: List[OrderItemCreate] = Field(..., min_length=1, description="Order must contain at least 1 item")


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|confirmed|processing|delivered|cancelled)$")


class OrderResponse(BaseModel):
    id: UUID
    store_id: UUID
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    total_amount: Decimal
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True

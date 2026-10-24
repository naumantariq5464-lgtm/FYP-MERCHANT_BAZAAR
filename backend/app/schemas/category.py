from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class CategoryResponse(CategoryBase):
    id: UUID
    store_id: UUID
    created_at: datetime
    products_count: Optional[int] = 0

    class Config:
        from_attributes = True

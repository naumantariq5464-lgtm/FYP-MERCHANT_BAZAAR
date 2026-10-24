from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_seller
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services import store_service, product_service

router = APIRouter()


@router.get("", response_model=List[ProductResponse], summary="List Products")
def list_products(
    category_id: Optional[UUID] = Query(None, description="Filter by category ID"),
    status: Optional[str] = Query(None, description="Filter by status: active / inactive"),
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """List all products in the seller's store with optional filtering."""
    store = store_service.get_seller_store(db, current_seller.id)
    return product_service.list_products(db, store.id, category_id, status)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, summary="Create Product")
def create_product(
    data: ProductCreate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Create a new product with images and variants in the seller's store."""
    store = store_service.get_seller_store(db, current_seller.id)
    return product_service.create_product(db, store.id, data)


@router.get("/{product_id}", response_model=ProductResponse, summary="Get Product Details")
def get_product(
    product_id: UUID,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get single product details."""
    store = store_service.get_seller_store(db, current_seller.id)
    return product_service.get_product_detail(db, store.id, product_id)


@router.put("/{product_id}", response_model=ProductResponse, summary="Update Product")
def update_product(
    product_id: UUID,
    data: ProductUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update product details, pricing, inventory, images, or variants."""
    store = store_service.get_seller_store(db, current_seller.id)
    return product_service.update_product(db, store.id, product_id, data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Product")
def delete_product(
    product_id: UUID,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Delete a product from the seller's store."""
    store = store_service.get_seller_store(db, current_seller.id)
    product_service.delete_product(db, store.id, product_id)
    return None

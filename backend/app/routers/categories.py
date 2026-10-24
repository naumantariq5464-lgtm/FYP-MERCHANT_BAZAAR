from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_seller
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services import store_service, category_service

router = APIRouter()


@router.get("", response_model=List[CategoryResponse], summary="List Categories")
def list_categories(
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """List all categories for the authenticated seller's store."""
    store = store_service.get_seller_store(db, current_seller.id)
    return category_service.list_categories(db, store.id)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED, summary="Create Category")
def create_category(
    data: CategoryCreate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Create a new product category in the seller's store."""
    store = store_service.get_seller_store(db, current_seller.id)
    return category_service.create_category(db, store.id, data)


@router.put("/{category_id}", response_model=CategoryResponse, summary="Update Category")
def update_category(
    category_id: UUID,
    data: CategoryUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Rename an existing category."""
    store = store_service.get_seller_store(db, current_seller.id)
    return category_service.update_category(db, store.id, category_id, data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Category")
def delete_category(
    category_id: UUID,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Delete a category from the seller's store."""
    store = store_service.get_seller_store(db, current_seller.id)
    category_service.delete_category(db, store.id, category_id)
    return None

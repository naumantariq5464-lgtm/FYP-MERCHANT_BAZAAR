from uuid import UUID
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from fastapi import HTTPException, status

from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse


def list_categories(db: Session, store_id: UUID) -> List[CategoryResponse]:
    """List all categories for a specific store with product counts."""
    # Query categories with count of associated products
    stmt = (
        select(Category, func.count(Product.id).label("products_count"))
        .outerjoin(Product, Product.category_id == Category.id)
        .where(Category.store_id == store_id)
        .group_by(Category.id)
        .order_by(Category.name.asc())
    )
    results = db.execute(stmt).all()

    category_list = []
    for cat, count in results:
        resp = CategoryResponse(
            id=cat.id,
            store_id=cat.store_id,
            name=cat.name,
            created_at=cat.created_at,
            products_count=count,
        )
        category_list.append(resp)
    return category_list


def create_category(db: Session, store_id: UUID, data: CategoryCreate) -> Category:
    """Create a new category for a store."""
    # Check if a category with this exact name already exists in this store
    existing = db.scalar(
        select(Category).where(
            Category.store_id == store_id,
            func.lower(Category.name) == func.lower(data.name.strip()),
        )
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this name already exists in your store."
        )

    category = Category(
        store_id=store_id,
        name=data.name.strip(),
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, store_id: UUID, category_id: UUID, data: CategoryUpdate) -> Category:
    """Update a category name."""
    category = db.scalar(
        select(Category).where(
            Category.id == category_id,
            Category.store_id == store_id,
        )
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found."
        )

    category.name = data.name.strip()
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, store_id: UUID, category_id: UUID) -> None:
    """Delete a category (products in this category will have category_id set to NULL)."""
    category = db.scalar(
        select(Category).where(
            Category.id == category_id,
            Category.store_id == store_id,
        )
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found."
        )

    db.delete(category)
    db.commit()

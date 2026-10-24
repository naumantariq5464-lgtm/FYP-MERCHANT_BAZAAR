from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from app.database import get_db
from app.models.store import Store, StoreStatus
from app.models.product import Product, ProductStatus
from app.models.category import Category
from app.schemas.store import StoreResponse
from app.schemas.product import ProductResponse
from app.schemas.category import CategoryResponse
from app.schemas.order import OrderCreate, OrderResponse
from app.services.product_service import _format_product_response
from app.services import order_service

router = APIRouter()


def _get_published_store(db: Session, subdomain: str) -> Store:
    """Helper to retrieve a live/published store by its subdomain."""
    stmt = (
        select(Store)
        .options(joinedload(Store.settings))
        .where(
            Store.slug == subdomain.lower().strip(),
            Store.status == StoreStatus.PUBLISHED
        )
    )
    store = db.scalar(stmt)
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Storefront not found or is currently unpublished."
        )
    return store


@router.get("/stores/{subdomain}", response_model=StoreResponse, summary="Get Public Storefront Profile")
def get_public_store(subdomain: str, db: Session = Depends(get_db)):
    """Fetch branding and theme configuration for a published store."""
    return _get_published_store(db, subdomain)


@router.get("/stores/{subdomain}/categories", response_model=List[CategoryResponse], summary="Get Public Store Categories")
def get_public_categories(subdomain: str, db: Session = Depends(get_db)):
    """Fetch categories available in this published store."""
    store = _get_published_store(db, subdomain)
    categories = db.scalars(
        select(Category).where(Category.store_id == store.id).order_by(Category.name.asc())
    ).all()
    return categories


@router.get("/stores/{subdomain}/products", response_model=List[ProductResponse], summary="List Public Store Products")
def get_public_products(
    subdomain: str,
    category_id: Optional[UUID] = Query(None, description="Optional category filter"),
    db: Session = Depends(get_db)
):
    """Fetch all active products with images and variants for buyers."""
    store = _get_published_store(db, subdomain)

    stmt = (
        select(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.images),
            joinedload(Product.variants),
        )
        .where(
            Product.store_id == store.id,
            Product.status == ProductStatus.ACTIVE
        )
        .order_by(Product.created_at.desc())
    )

    if category_id:
        stmt = stmt.where(Product.category_id == category_id)

    products = db.scalars(stmt).unique().all()
    return [_format_product_response(p) for p in products]


@router.get("/stores/{subdomain}/products/{product_id}", response_model=ProductResponse, summary="Get Single Product Details")
def get_public_product_detail(subdomain: str, product_id: UUID, db: Session = Depends(get_db)):
    """Fetch single active product details for the buyer storefront."""
    store = _get_published_store(db, subdomain)

    stmt = (
        select(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.images),
            joinedload(Product.variants),
        )
        .where(
            Product.id == product_id,
            Product.store_id == store.id,
            Product.status == ProductStatus.ACTIVE
        )
    )
    product = db.scalar(stmt)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or unavailable."
        )

    return _format_product_response(product)


@router.post("/stores/{subdomain}/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED, summary="Guest Checkout (Place Order)")
def place_order(
    subdomain: str,
    data: OrderCreate,
    db: Session = Depends(get_db)
):
    """Place a guest order with atomic inventory deduction and price snapshot."""
    return order_service.create_public_order(db, subdomain, data)


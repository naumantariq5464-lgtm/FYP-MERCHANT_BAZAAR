from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.store import Store, StoreStatus
from app.models.product import Product
from app.models.order import Order
from app.dependencies.auth import get_current_admin

router = APIRouter()


class AdminStoreResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    status: str
    seller_name: str
    seller_email: str
    products_count: int
    orders_count: int
    created_at: str


class AdminUserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    is_active: bool
    store_name: Optional[str] = None
    created_at: str


class StoreStatusUpdate(BaseModel):
    status: str


@router.get("/stats", summary="Get Platform Platform Stats")
def get_platform_stats(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve platform-wide governance metrics."""
    total_stores = db.scalar(select(func.count(Store.id))) or 0
    published_stores = db.scalar(select(func.count(Store.id)).where(Store.status == StoreStatus.PUBLISHED)) or 0
    draft_stores = db.scalar(select(func.count(Store.id)).where(Store.status == StoreStatus.DRAFT)) or 0
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_products = db.scalar(select(func.count(Product.id))) or 0
    total_orders = db.scalar(select(func.count(Order.id))) or 0

    return {
        "total_stores": total_stores,
        "published_stores": published_stores,
        "draft_stores": draft_stores,
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
    }


@router.get("/stores", response_model=List[AdminStoreResponse], summary="List All Stores")
def get_all_stores(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all registered stores across the multi-tenant platform."""
    stores = db.scalars(
        select(Store).options(joinedload(Store.seller)).order_by(Store.created_at.desc())
    ).all()

    result = []
    for s in stores:
        prod_count = db.scalar(select(func.count(Product.id)).where(Product.store_id == s.id)) or 0
        ord_count = db.scalar(select(func.count(Order.id)).where(Order.store_id == s.id)) or 0
        result.append(
            AdminStoreResponse(
                id=s.id,
                name=s.name,
                slug=s.slug,
                status=s.status.value if hasattr(s.status, "value") else str(s.status),
                seller_name=s.seller.name if s.seller else "Unknown",
                seller_email=s.seller.email if s.seller else "Unknown",
                products_count=prod_count,
                orders_count=ord_count,
                created_at=s.created_at.isoformat(),
            )
        )
    return result


@router.put("/stores/{store_id}/status", summary="Update Store Status (Governance)")
def update_store_status(
    store_id: UUID,
    data: StoreStatusUpdate,
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Suspend, draft, or publish a store."""
    store = db.scalar(select(Store).where(Store.id == store_id))
    if not store:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")

    try:
        store.status = StoreStatus(data.status.lower())
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid store status")

    db.commit()
    db.refresh(store)
    return {"message": "Store status updated", "status": store.status.value}


@router.get("/users", response_model=List[AdminUserResponse], summary="List All Platform Users")
def get_all_users(
    admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all merchants and registered accounts."""
    users = db.scalars(
        select(User).options(joinedload(User.store)).order_by(User.created_at.desc())
    ).all()

    return [
        AdminUserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            role="seller",
            is_active=u.is_active,
            store_name=u.store.name if u.store else None,
            created_at=u.created_at.isoformat(),
        )
        for u in users
    ]

from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_seller
from app.schemas.order import OrderResponse, OrderStatusUpdate
from app.services import store_service, order_service

router = APIRouter()


@router.get("", response_model=List[OrderResponse], summary="List Seller Orders")
def list_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Retrieve incoming customer orders for the authenticated seller's store."""
    store = store_service.get_seller_store(db, current_seller.id)
    return order_service.list_seller_orders(db, store.id, status)


@router.get("/{order_id}", response_model=OrderResponse, summary="Get Single Order")
def get_order(
    order_id: UUID,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Retrieve details and item breakdown for a specific order."""
    store = store_service.get_seller_store(db, current_seller.id)
    return order_service.get_seller_order(db, store.id, order_id)


@router.put("/{order_id}/status", response_model=OrderResponse, summary="Update Order Status")
def update_order_status(
    order_id: UUID,
    data: OrderStatusUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update fulfillment status (pending, confirmed, processing, delivered, cancelled)."""
    store = store_service.get_seller_store(db, current_seller.id)
    return order_service.update_order_status(db, store.id, order_id, data.status)

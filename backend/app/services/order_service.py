from uuid import UUID
from typing import List, Optional
from decimal import Decimal
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.store import Store, StoreStatus
from app.models.product import Product, ProductStatus
from app.models.product_variant import ProductVariant
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse


def _format_order_response(order: Order) -> OrderResponse:
    """Helper to convert Order model to OrderResponse schema."""
    return OrderResponse(
        id=order.id,
        store_id=order.store_id,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        delivery_address=order.delivery_address,
        total_amount=order.total_amount,
        status=order.status.value if hasattr(order.status, "value") else order.status,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=[
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                variant_id=item.variant_id,
                product_name=item.product_name,
                variant_info=item.variant_info,
                unit_price=item.unit_price,
                quantity=item.quantity,
            )
            for item in order.items
        ],
    )


def create_public_order(db: Session, subdomain: str, data: OrderCreate) -> OrderResponse:
    """
    Process guest checkout: validates product stock, deducts inventory,
    creates order with item price snapshots, and commits atomically.
    """
    # 1. Fetch published store
    store = db.scalar(
        select(Store).where(
            Store.slug == subdomain.lower().strip(),
            Store.status == StoreStatus.PUBLISHED
        )
    )
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Storefront not found or is currently unpublished."
        )

    # 2. Create the order header
    order = Order(
        store_id=store.id,
        customer_name=data.customer_name.strip(),
        customer_email=data.customer_email.strip().lower(),
        customer_phone=data.customer_phone.strip(),
        delivery_address=data.delivery_address.strip(),
        total_amount=Decimal("0.00"),
        status=OrderStatus.PENDING,
    )
    db.add(order)
    db.flush()  # Generates order.id

    calculated_total = Decimal("0.00")

    # 3. Validate each item and deduct inventory
    for item in data.items:
        product = db.scalar(
            select(Product).where(
                Product.id == item.product_id,
                Product.store_id == store.id,
                Product.status == ProductStatus.ACTIVE
            )
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more products are unavailable in this store."
            )

        # Check product stock
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.name}'. Only {product.stock_quantity} left."
            )

        # Check variant if specified
        unit_price = Decimal(str(product.price))
        variant_info = None

        if item.variant_id:
            variant = db.scalar(
                select(ProductVariant).where(
                    ProductVariant.id == item.variant_id,
                    ProductVariant.product_id == product.id
                )
            )
            if not variant:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Selected option for '{product.name}' is invalid."
                )

            if variant.stock_qty < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {variant.variant_type}: {variant.variant_value}."
                )

            variant.stock_qty -= item.quantity
            unit_price += Decimal(str(variant.extra_price))
            variant_info = f"{variant.variant_type}: {variant.variant_value}"

        # Deduct base product stock
        product.stock_quantity -= item.quantity

        line_total = unit_price * item.quantity
        calculated_total += line_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            variant_id=item.variant_id,
            product_name=product.name,
            variant_info=variant_info,
            unit_price=unit_price,
            quantity=item.quantity,
        )
        db.add(order_item)

    # 4. Set final order total and commit
    order.total_amount = calculated_total
    db.commit()
    db.refresh(order)

    return _format_order_response(order)


def list_seller_orders(
    db: Session,
    store_id: UUID,
    status_filter: Optional[str] = None
) -> List[OrderResponse]:
    """Retrieve all orders belonging to the seller's store."""
    stmt = (
        select(Order)
        .options(joinedload(Order.items))
        .where(Order.store_id == store_id)
        .order_by(Order.created_at.desc())
    )

    if status_filter:
        stmt = stmt.where(Order.status == status_filter)

    orders = db.scalars(stmt).unique().all()
    return [_format_order_response(o) for o in orders]


def get_seller_order(db: Session, store_id: UUID, order_id: UUID) -> OrderResponse:
    """Retrieve a single order for the authenticated seller."""
    stmt = (
        select(Order)
        .options(joinedload(Order.items))
        .where(Order.id == order_id, Order.store_id == store_id)
    )
    order = db.scalar(stmt)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found in your store."
        )
    return _format_order_response(order)


def update_order_status(
    db: Session,
    store_id: UUID,
    order_id: UUID,
    new_status: str
) -> OrderResponse:
    """Update order fulfillment status (pending, confirmed, processing, delivered, cancelled)."""
    stmt = (
        select(Order)
        .options(joinedload(Order.items))
        .where(Order.id == order_id, Order.store_id == store_id)
    )
    order = db.scalar(stmt)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found in your store."
        )

    try:
        order.status = OrderStatus(new_status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{new_status}'."
        )

    db.commit()
    db.refresh(order)
    return _format_order_response(order)

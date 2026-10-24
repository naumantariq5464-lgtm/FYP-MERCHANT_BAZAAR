from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.product import Product, ProductStatus
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant, VariantType
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse


def _normalize_variant_type(raw: str) -> VariantType:
    """Normalize input variant type to match database enum."""
    normalized = (raw or "").strip().upper()
    try:
        return VariantType[normalized]
    except KeyError:
        return VariantType.SIZE


def _format_product_response(product: Product) -> ProductResponse:
    """Helper to convert Product model to ProductResponse with category name."""
    return ProductResponse(
        id=product.id,
        store_id=product.store_id,
        category_id=product.category_id,
        category_name=product.category.name if product.category else None,
        name=product.name,
        description=product.description,
        price=product.price,
        stock_quantity=product.stock_quantity,
        status=product.status.value if hasattr(product.status, "value") else product.status,
        created_at=product.created_at,
        updated_at=product.updated_at,
        images=product.images,
        variants=product.variants,
    )


def list_products(
    db: Session,
    store_id: UUID,
    category_id: Optional[UUID] = None,
    status_filter: Optional[str] = None
) -> List[ProductResponse]:
    """List products belonging to a store with optional filtering."""
    stmt = (
        select(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.images),
            joinedload(Product.variants),
        )
        .where(Product.store_id == store_id)
        .order_by(Product.created_at.desc())
    )

    if category_id:
        stmt = stmt.where(Product.category_id == category_id)
    if status_filter:
        stmt = stmt.where(Product.status == status_filter)

    products = db.scalars(stmt).unique().all()
    return [_format_product_response(p) for p in products]


def get_product(db: Session, store_id: UUID, product_id: UUID) -> Product:
    """Fetch a single product ensuring it belongs to the given store."""
    stmt = (
        select(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.images),
            joinedload(Product.variants),
        )
        .where(Product.id == product_id, Product.store_id == store_id)
    )
    product = db.scalar(stmt)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found in this store."
        )
    return product


def get_product_detail(db: Session, store_id: UUID, product_id: UUID) -> ProductResponse:
    """Fetch a single product formatted for response."""
    product = get_product(db, store_id, product_id)
    return _format_product_response(product)



def create_product(db: Session, store_id: UUID, data: ProductCreate) -> ProductResponse:
    """Create a new product with optional images and variants."""
    # Verify category belongs to this store if provided
    if data.category_id:
        category = db.scalar(
            select(Category).where(
                Category.id == data.category_id,
                Category.store_id == store_id
            )
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected category does not exist in your store."
            )

    product = Product(
        store_id=store_id,
        category_id=data.category_id,
        name=data.name.strip(),
        description=data.description,
        price=data.price,
        stock_quantity=data.stock_quantity,
        status=ProductStatus(data.status),
    )
    db.add(product)
    db.flush()  # Generates product.id

    # Add images
    for index, url in enumerate(data.images):
        img = ProductImage(
            product_id=product.id,
            image_url=url,
            display_order=index,
        )
        db.add(img)

    # Add variants
    for variant in data.variants:
        var = ProductVariant(
            product_id=product.id,
            variant_type=_normalize_variant_type(variant.variant_type),
            variant_value=variant.variant_value,
            extra_price=variant.extra_price,
            stock_quantity=variant.stock_qty,
        )
        db.add(var)

    db.commit()
    db.refresh(product)
    return _format_product_response(product)


def update_product(db: Session, store_id: UUID, product_id: UUID, data: ProductUpdate) -> ProductResponse:
    """Update product details, images, and variants."""
    product = get_product(db, store_id, product_id)

    # Verify category if changed
    if data.category_id is not None:
        if data.category_id != product.category_id:
            category = db.scalar(
                select(Category).where(
                    Category.id == data.category_id,
                    Category.store_id == store_id
                )
            )
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Selected category does not exist in your store."
                )
        product.category_id = data.category_id

    # Update basic fields
    if data.name is not None:
        product.name = data.name.strip()
    if data.description is not None:
        product.description = data.description
    if data.price is not None:
        product.price = data.price
    if data.stock_quantity is not None:
        product.stock_quantity = data.stock_quantity
    if data.status is not None:
        product.status = ProductStatus(data.status)

    # Update images if provided
    if data.images is not None:
        product.images.clear()
        for index, url in enumerate(data.images):
            product.images.append(ProductImage(image_url=url, display_order=index))

    # Update variants if provided
    if data.variants is not None:
        product.variants.clear()
        for variant in data.variants:
            product.variants.append(
                ProductVariant(
                    variant_type=_normalize_variant_type(variant.variant_type),
                    variant_value=variant.variant_value,
                    extra_price=variant.extra_price,
                    stock_quantity=variant.stock_qty,
                )
            )

    db.commit()
    db.refresh(product)
    return _format_product_response(product)


def delete_product(db: Session, store_id: UUID, product_id: UUID) -> None:
    """Delete a product."""
    product = get_product(db, store_id, product_id)
    db.delete(product)
    db.commit()

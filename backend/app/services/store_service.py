from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.store import Store, StoreStatus
from app.models.store_settings import StoreSettings
from app.schemas.store import StoreUpdate, StoreSettingsUpdate


def get_seller_store(db: Session, seller_id: UUID) -> Store:
    """Fetch the store belonging to the logged-in seller, including its settings."""
    stmt = (
        select(Store)
        .options(joinedload(Store.settings))
        .where(Store.seller_id == seller_id)
    )
    store = db.scalar(stmt)
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found for this seller account."
        )
    return store


def update_seller_store(db: Session, store: Store, data: StoreUpdate) -> Store:
    """Update general store profile details."""
    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(store, field, value)

    if store.status == StoreStatus.PUBLISHED:
        store.status = StoreStatus.DRAFT

    db.commit()
    db.refresh(store)
    return store


def update_seller_store_settings(db: Session, store: Store, data: StoreSettingsUpdate) -> StoreSettings:
    """Update branding, hero images, and theme colors for the store."""
    if not store.settings:
        store.settings = StoreSettings(store_id=store.id)
        db.add(store.settings)

    update_dict = data.model_dump(exclude_unset=True)

    # Map aliases to database columns
    if "hero_banner_url" in update_dict:
        banner = update_dict.pop("hero_banner_url")
        if banner:
            update_dict["hero_images"] = [banner]
    if "hero_title" in update_dict:
        update_dict["hero_heading"] = update_dict.pop("hero_title")
    if "hero_subtitle" in update_dict:
        update_dict["hero_description"] = update_dict.pop("hero_subtitle")

    for field, value in update_dict.items():
        if hasattr(store.settings, field):
            setattr(store.settings, field, value)

    if store.status == StoreStatus.PUBLISHED:
        store.status = StoreStatus.DRAFT
        db.add(store)

    db.commit()
    db.refresh(store.settings)
    return store.settings


def toggle_store_publish(db: Session, store: Store) -> Store:
    """Publish or unpublish the store with strict completion validation."""
    if store.status == StoreStatus.PUBLISHED:
        store.status = StoreStatus.DRAFT
    else:
        # 1. Validate that the store has at least a name and slug
        if not store.name or not store.slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Store must have a name and subdomain slug before publishing."
            )
        # 2. Validate branding customization
        is_customized = bool(store.settings and (
            store.settings.logo_url or
            (store.settings.hero_images and len(store.settings.hero_images) > 0) or
            (store.settings.primary_color and store.settings.primary_color != "#1a5c38")
        ))
        if not is_customized:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please customize your store branding (upload logo or banner) before publishing."
            )
        # 3. Validate at least 1 product exists
        from app.models.product import Product
        from sqlalchemy import func
        prod_count = db.scalar(select(func.count(Product.id)).where(Product.store_id == store.id))
        if not prod_count or prod_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Your store has no products! Please add at least one product before publishing."
            )
        store.status = StoreStatus.PUBLISHED

    db.commit()
    db.refresh(store)
    return store

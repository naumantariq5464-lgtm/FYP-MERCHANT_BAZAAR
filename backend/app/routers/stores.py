from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_seller
from app.schemas.store import StoreResponse, StoreUpdate, StoreSettingsResponse, StoreSettingsUpdate
from app.services import store_service

router = APIRouter()


@router.get("/me", response_model=StoreResponse, summary="Get Current Seller's Store")
def get_my_store(
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Retrieve the store profile and settings for the authenticated seller."""
    return store_service.get_seller_store(db, current_seller.id)


@router.put("/me", response_model=StoreResponse, summary="Update Store Profile")
def update_my_store(
    data: StoreUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update store name, description, or business category."""
    store = store_service.get_seller_store(db, current_seller.id)
    return store_service.update_seller_store(db, store, data)


@router.put("/me/settings", response_model=StoreSettingsResponse, summary="Update Store Branding & Theme")
def update_my_store_settings(
    data: StoreSettingsUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update logo URL, hero banner images, headings, and primary theme color."""
    store = store_service.get_seller_store(db, current_seller.id)
    return store_service.update_seller_store_settings(db, store, data)


@router.post("/me/publish", response_model=StoreResponse, summary="Toggle Store Published Status")
def toggle_publish(
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Toggle the store between draft and published status."""
    store = store_service.get_seller_store(db, current_seller.id)
    return store_service.toggle_store_publish(db, store)

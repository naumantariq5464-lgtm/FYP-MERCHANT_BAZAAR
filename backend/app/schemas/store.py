from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, computed_field


class StoreSettingsBase(BaseModel):
    logo_url: Optional[str] = None
    hero_images: List[str] = Field(default_factory=list)
    hero_heading: Optional[str] = None
    hero_description: Optional[str] = None
    promotional_text: Optional[str] = None
    primary_color: str = "#1a5c38"


class StoreSettingsUpdate(BaseModel):
    logo_url: Optional[str] = None
    hero_images: Optional[List[str]] = None
    hero_banner_url: Optional[str] = None
    hero_heading: Optional[str] = None
    hero_title: Optional[str] = None
    hero_description: Optional[str] = None
    hero_subtitle: Optional[str] = None
    promotional_text: Optional[str] = None
    primary_color: Optional[str] = None


class StoreSettingsResponse(StoreSettingsBase):
    id: UUID
    store_id: UUID

    @computed_field
    def hero_banner_url(self) -> Optional[str]:
        return self.hero_images[0] if self.hero_images else None

    @computed_field
    def hero_title(self) -> Optional[str]:
        return self.hero_heading

    @computed_field
    def hero_subtitle(self) -> Optional[str]:
        return self.hero_description

    class Config:
        from_attributes = True


class StoreBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    business_category: Optional[str] = Field(None, max_length=100)


class StoreUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    business_category: Optional[str] = Field(None, max_length=100)


class StoreResponse(StoreBase):
    id: UUID
    seller_id: UUID
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime
    settings: Optional[StoreSettingsResponse] = None

    class Config:
        from_attributes = True

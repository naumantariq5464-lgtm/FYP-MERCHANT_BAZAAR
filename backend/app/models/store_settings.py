import uuid
from sqlalchemy import Column, String, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class StoreSettings(Base):
    __tablename__ = "store_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    store_id = Column(UUID(as_uuid=True), ForeignKey("stores.id", ondelete="CASCADE"), nullable=False, unique=True)
    logo_url = Column(String(500), nullable=True)
    hero_images = Column(JSON, default=list, nullable=False)  # List of up to 3 image URLs
    hero_heading = Column(String(200), nullable=True)
    hero_description = Column(Text, nullable=True)
    promotional_text = Column(Text, nullable=True)
    primary_color = Column(String(10), default="#1a5c38", nullable=False)

    # Relationships
    store = relationship("Store", back_populates="settings")

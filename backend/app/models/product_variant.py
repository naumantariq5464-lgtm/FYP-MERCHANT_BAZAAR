import uuid
from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, synonym
import enum
from app.database import Base


class VariantType(str, enum.Enum):
    SIZE = "size"
    COLOR = "color"
    MATERIAL = "material"


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_type = Column(SAEnum(VariantType), nullable=False)
    variant_value = Column(String(100), nullable=False)  # e.g. "XL", "Red"
    extra_price = Column(Numeric(10, 2), default=0.00, nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)

    stock_qty = synonym("stock_quantity")

    # Relationships
    product = relationship("Product", back_populates="variants")
    order_items = relationship("OrderItem", back_populates="variant")

from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.database import Base
from datetime import datetime

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    # Every measurement must belong to a specific shop and customer
    shop_id = Column(Integer, ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Label to distinguish between different measurement sets (e.g., "Slim Fit", "Wedding Outfit")
    label = Column(String, nullable=True, default="Standard")

    # Garment measurements (Stored as Floats for precision)
    chest = Column(Float, nullable=True)
    waist = Column(Float, nullable=True)
    hips = Column(Float, nullable=True)
    sleeve_length = Column(Float, nullable=True)
    shoulder = Column(Float, nullable=True)
    inseam = Column(Float, nullable=True)
    neck = Column(Float, nullable=True)
    coat_length = Column(Float, nullable=True)
    pant_length = Column(Float, nullable=True)
    shalwar_length = Column(Float, nullable=True)
    
    # Text field for extra details like "slanted pockets" or "loose cuffs"
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="measurements")
    shop = relationship("Shop", back_populates="measurements")
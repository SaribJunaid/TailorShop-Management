from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class OrderItem(Base):
    """Represents an individual garment within a larger Order."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    
    # Link to the specific measurement set used for this garment
    measurement_id = Column(Integer, ForeignKey("measurements.id"), nullable=False)
    
    # Link to the stitcher/tailor assigned to this specific piece
    stitcher_id = Column(Integer, ForeignKey("stitchers.id"), nullable=True)

    garment_type = Column(String, nullable=False) # e.g., "Sherwani", "Pant", "Shirt"
    price = Column(Float, nullable=False)
    
    # Status tracking for this specific piece
    status = Column(String, default="queued") # queued, cutting, stitching, ready, completed
    
    # Special instructions for this specific piece (e.g., "double pocket")
    notes = Column(String, nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    measurement = relationship("Measurement")
    stitcher = relationship("Stitcher", back_populates="assigned_items")
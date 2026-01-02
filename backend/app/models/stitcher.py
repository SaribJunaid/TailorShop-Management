from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class Stitcher(Base):
    __tablename__ = "stitchers"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)
    
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    specialty = Column(String, nullable=True) # e.g., "Sherwani specialist", "Pants"

    # Relationships
    shop = relationship("Shop", back_populates="stitchers")
    # Link to OrderItems (replacing the old 'assignments' logic)
    assigned_items = relationship("OrderItem", back_populates="stitcher")
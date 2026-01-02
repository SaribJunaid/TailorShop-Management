from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    # Mandating shop_id with an index for high-speed filtering
    shop_id = Column(Integer, ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)

    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True) 

    # Relationships
    shop = relationship("Shop", back_populates="customers")
    measurements = relationship("Measurement", back_populates="customer", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="customer")
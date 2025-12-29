from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    
    # Garment measurements (neutral values)
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
    
    description = Column(String, nullable=True)
    advance_payment = Column(Float, default=0)
    remaining_amount = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="measurements")
    shop = relationship("Shop", back_populates="measurements")

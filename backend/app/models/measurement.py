from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    description = Column(String, nullable=True)
    advance_payment = Column(Float, default=0)
    remaining_amount = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="measurements")
    shop = relationship("Shop", back_populates="measurements")
    pieces = relationship("Piece", back_populates="measurement")

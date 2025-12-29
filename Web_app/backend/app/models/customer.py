from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"))

    name = Column(String, nullable=False)
    phone = Column(String)
    address = Column(String)

    shop = relationship("Shop", back_populates="customers")
    measurements = relationship("Measurement", back_populates="customer")

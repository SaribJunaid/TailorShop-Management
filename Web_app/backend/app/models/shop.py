from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.database import Base

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String)
    address = Column(String)

    # Relationships
    users = relationship("User", back_populates="shop")
    customers = relationship("Customer", back_populates="shop")
    measurements = relationship("Measurement", back_populates="shop")
    stitchers = relationship("Stitcher", back_populates="shop")
    

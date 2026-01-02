from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.database import Base

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)

    # Relationships
    # These tell SQLAlchemy how to link other tables back to the Shop
    users = relationship("User", back_populates="shop", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="shop", cascade="all, delete-orphan")
    stitchers = relationship("Stitcher", back_populates="shop", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="shop", cascade="all, delete-orphan")
    measurements = relationship("Measurement", back_populates="shop", cascade="all, delete-orphan")
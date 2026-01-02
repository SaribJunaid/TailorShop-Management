from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # This foreign key ensures every user belongs to a specific shop
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)

    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    phone = Column(String, nullable=True)

    # Relationship back to the Shop
    shop = relationship("Shop", back_populates="users")
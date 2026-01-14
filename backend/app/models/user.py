# from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     # This foreign key ensures every user belongs to a specific shop
#     shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)

#     name = Column(String, nullable=False)
#     username = Column(String, unique=True, index=True, nullable=False)
#     password_hash = Column(String, nullable=False)
#     is_active = Column(Boolean, default=True)
#     phone = Column(String, nullable=True)

#     # Relationship back to the Shop
#     shop = relationship("Shop", back_populates="users")

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    
    # --- SAAS ADMIN FIELDS ---
    is_active = Column(Boolean, default=True) # Your "Master Switch"
    is_admin = Column(Boolean, default=False) # Your identity
    created_at = Column(DateTime, default=func.now()) 
    
    # Set this to NULL by default. If Admin manually activates, we set a date.
    subscription_expires_at = Column(DateTime, nullable=True)

    shop = relationship("Shop", back_populates="users")
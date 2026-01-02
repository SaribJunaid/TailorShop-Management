import uuid
from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from app.models.database import Base
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    # Secure Public ID for WhatsApp sharing links (e.g., /receipt/view/abc-123)
    public_id = Column(String, unique=True, default=lambda: str(uuid.uuid4()), index=True)
    
    shop_id = Column(Integer, ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Financials
    total_amount = Column(Float, default=0.0)
    advance_paid = Column(Float, default=0.0)
    balance_due = Column(Float, default=0.0) # Calculated: total_amount - advance_paid
    
    # Tracking
    status = Column(String, default="pending") # pending, processing, ready, delivered, cancelled
    priority = Column(String, default="normal") # normal, urgent
    
    # Dates
    due_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    shop = relationship("Shop", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")
    # Link to individual garments in this order
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
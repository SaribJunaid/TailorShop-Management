from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date, datetime
from app.schemas.order_item import OrderItemCreate, OrderItemRead
from app.schemas.stitcher import StitcherRead # Ensure this import exists

class OrderBase(BaseModel):
    customer_id: int
    due_date: date
    total_amount: float
    advance_paid: float
    priority: Optional[str] = "normal"
    status: Optional[str] = "pending"

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    due_date: Optional[date] = None
    total_amount: Optional[float] = None
    advance_paid: Optional[float] = None
    priority: Optional[str] = None
    status: Optional[str] = None # This allows manual status changes
    customer_id: Optional[int] = None

class OrderRead(OrderBase):
    id: int
    public_id: str
    shop_id: int
    balance_due: float
    created_at: datetime
    items: List[OrderItemRead]
    # To show customer name in Order Cards
    customer_name: Optional[str] = None
    total_amount: float
    advance_paid: float
    status: str
    due_date: date  # Ensure this is str or date
    priority: str
    model_config = ConfigDict(from_attributes=True)
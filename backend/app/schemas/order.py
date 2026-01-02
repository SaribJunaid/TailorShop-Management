from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date, datetime
from app.schemas.order_item import OrderItemCreate, OrderItemRead

class OrderBase(BaseModel):
    customer_id: int
    due_date: date
    total_amount: float
    advance_paid: float
    priority: Optional[str] = "normal"
    status: Optional[str] = "pending"

class OrderCreate(OrderBase):
    # This allows creating an order and its items in one API call
    items: List[OrderItemCreate]

class OrderRead(OrderBase):
    id: int
    public_id: str
    shop_id: int
    balance_due: float
    created_at: datetime
    # This automatically includes the list of items when returning the order
    items: List[OrderItemRead]

    model_config = ConfigDict(from_attributes=True)
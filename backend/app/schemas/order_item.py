from pydantic import BaseModel, ConfigDict
from typing import Optional

class OrderItemBase(BaseModel):
    garment_type: str  # e.g., "Sherwani", "Waistcoat"
    price: float
    measurement_id: int
    stitcher_id: Optional[int] = None
    status: Optional[str] = "queued"
    notes: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemRead(OrderItemBase):
    id: int
    order_id: int

    model_config = ConfigDict(from_attributes=True)
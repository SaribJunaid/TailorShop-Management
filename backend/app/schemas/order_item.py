from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.stitcher import StitcherRead

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
    stitcher: Optional[StitcherRead] = None
    model_config = ConfigDict(from_attributes=True)

class OrderItemUpdate(BaseModel):
    garment_type: Optional[str] = None
    price: Optional[float] = None
    measurement_id: Optional[int] = None
    stitcher_id: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None
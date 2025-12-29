from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeasurementBase(BaseModel):
    customer_id: int
    shop_id: int
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None
    sleeve_length: Optional[float] = None
    shoulder: Optional[float] = None
    inseam: Optional[float] = None
    neck: Optional[float] = None
    coat_length: Optional[float] = None
    pant_length: Optional[float] = None
    shalwar_length: Optional[float] = None
    description: Optional[str] = None
    advance_payment: Optional[float] = 0
    remaining_amount: Optional[float] = 0

class MeasurementCreate(MeasurementBase):
    pass

class MeasurementUpdate(BaseModel):
    chest: Optional[float]
    waist: Optional[float]
    hips: Optional[float]
    sleeve_length: Optional[float]
    shoulder: Optional[float]
    inseam: Optional[float]
    neck: Optional[float]
    coat_length: Optional[float]
    pant_length: Optional[float]
    shalwar_length: Optional[float]
    description: Optional[str]
    advance_payment: Optional[float]
    remaining_amount: Optional[float]

class MeasurementRead(MeasurementBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

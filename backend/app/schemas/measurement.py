from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MeasurementBase(BaseModel):
    label: Optional[str] = "Standard"
    
    # Physical dimensions
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

class MeasurementCreate(MeasurementBase):
    customer_id: int  # Must specify which customer these belong to

class MeasurementUpdate(MeasurementBase):
    # All fields are inherited as optional, allowing partial updates
    pass

class MeasurementRead(MeasurementBase):
    id: int
    customer_id: int
    shop_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
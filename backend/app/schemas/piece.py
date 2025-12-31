from pydantic import BaseModel
from typing import Optional
from app.schemas.measurement import MeasurementRead

class PieceBase(BaseModel):
    measurement_id: int
    name: str
    size_details: Optional[dict] = None
    status: Optional[str] = "pending"

class PieceCreate(PieceBase):
    pass

class PieceUpdate(BaseModel):
    name: Optional[str]
    size_details: Optional[dict]
    status: Optional[str]

class PieceRead(PieceBase):
    id: int
    measurement: Optional[MeasurementRead]

    class Config:
        orm_mode = True

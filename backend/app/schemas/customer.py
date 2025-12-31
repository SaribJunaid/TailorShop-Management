from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    shop_id: int

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str]
    phone: Optional[str]
    email: Optional[str]

class CustomerRead(CustomerBase):
    id: int

    class Config:
        orm_mode = True

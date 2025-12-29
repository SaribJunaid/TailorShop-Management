from pydantic import BaseModel
from typing import Optional

class ShopBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class ShopCreate(ShopBase):
    pass

class ShopUpdate(BaseModel):
    name: Optional[str]
    phone: Optional[str]
    address: Optional[str]

class ShopRead(ShopBase):
    id: int

    class Config:
        orm_mode = True

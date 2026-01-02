from pydantic import BaseModel, ConfigDict
from typing import Optional

class ShopBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class ShopCreate(ShopBase):
    pass  # Used during registration

class ShopRead(ShopBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
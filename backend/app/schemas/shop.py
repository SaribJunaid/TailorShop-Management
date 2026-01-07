# from pydantic import BaseModel, ConfigDict
# from typing import Optional

# class ShopBase(BaseModel):
#     name: str
#     phone: Optional[str] = None
#     address: Optional[str] = None

# class ShopCreate(ShopBase):
#     pass  # Used during registration

# class ShopRead(ShopBase):
#     id: int

#     model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from typing import Optional

class ShopBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    gst_number: Optional[str] = None

class ShopUpdate(ShopBase):
    # All fields become optional for updates
    name: Optional[str] = None

class ShopRead(ShopBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class CustomerBase(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None

class CustomerCreate(CustomerBase):
    pass  # shop_id is handled by the backend dependency, not the user

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class CustomerRead(CustomerBase):
    id: int
    shop_id: int

    model_config = ConfigDict(from_attributes=True)
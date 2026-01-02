from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class UserBase(BaseModel):
    username: str
    name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    shop_name: str # Used only during initial signup to create the shop and owner together

class UserRead(UserBase):
    id: int
    shop_id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
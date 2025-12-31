from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    username: str
    role: Optional[str] = "STAFF"
    shop_id: Optional[int] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str]
    username: Optional[str]
    role: Optional[str]
    is_active: Optional[bool]
    password: Optional[str]

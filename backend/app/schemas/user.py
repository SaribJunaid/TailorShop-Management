# from pydantic import BaseModel, ConfigDict, Field
# from typing import Optional

# class UserBase(BaseModel):
#     username: str
#     name: str
#     phone: Optional[str] = None

# class UserCreate(UserBase):
#     password: str = Field(..., min_length=8)
#     shop_name: str # Used only during initial signup to create the shop and owner together

# class UserRead(UserBase):
#     id: int
#     shop_id: int
#     is_active: bool

#     model_config = ConfigDict(from_attributes=True)

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class TokenData(BaseModel):
#     username: Optional[str] = None

from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional

# This is used when creating a user (Registration)
class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    phone: str
    shop_name: str # Used in the auth router to create the shop

# This is used for updating the profile (Settings)
class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    # We don't include password here to keep it simple, 
    # unless you want a separate "Change Password" feature.

# This is what the API returns (No password hash!)
class UserRead(BaseModel):
    id: int
    username: str
    name: str
    phone: str
    shop_id: int
    is_active: bool
    is_admin: bool
    # Changed to datetime for accurate frontend logic
    created_at: datetime 
    subscription_expires_at: Optional[datetime] = None 

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
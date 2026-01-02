from pydantic import BaseModel, ConfigDict
from typing import Optional

class StitcherBase(BaseModel):
    name: str
    phone: Optional[str] = None
    specialty: Optional[str] = None

class StitcherCreate(StitcherBase):
    pass

class StitcherUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    specialty: Optional[str] = None

class StitcherRead(StitcherBase):
    id: int
    shop_id: int

    model_config = ConfigDict(from_attributes=True)
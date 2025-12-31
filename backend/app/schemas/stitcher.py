from pydantic import BaseModel
from typing import Optional

class StitcherBase(BaseModel):
    name: str

class StitcherCreate(StitcherBase):
    pass

class StitcherUpdate(BaseModel):
    name: Optional[str]

class StitcherRead(StitcherBase):
    id: int

    class Config:
        orm_mode = True

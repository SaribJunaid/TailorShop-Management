from pydantic import BaseModel
from typing import Optional

class AssignmentBase(BaseModel):
    piece_id: int
    stitcher_id: int
    status: Optional[str] = "assigned"

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseModel):
    status: Optional[str]

class AssignmentRead(AssignmentBase):
    id: int

    class Config:
        orm_mode = True

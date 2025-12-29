from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class Stitcher(Base):
    __tablename__ = "stitchers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    assignments = relationship("Assignment", back_populates="stitcher")

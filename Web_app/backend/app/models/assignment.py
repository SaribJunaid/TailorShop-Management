from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    piece_id = Column(Integer, ForeignKey("pieces.id"), nullable=False)
    stitcher_id = Column(Integer, ForeignKey("stitchers.id"), nullable=False)
    status = Column(String, default="assigned")  # assigned, in_progress, completed

    piece = relationship("Piece", back_populates="assignments")
    stitcher = relationship("Stitcher", back_populates="assignments")

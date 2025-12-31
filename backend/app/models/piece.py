from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Piece(Base):
    __tablename__ = "pieces"

    id = Column(Integer, primary_key=True, index=True)
    measurement_id = Column(Integer, ForeignKey("measurements.id"), nullable=False)
    name = Column(String, nullable=False)  # coat, pant, shalwar, sherwani, etc.
    size_details = Column(JSON, nullable=True)
    status = Column(String, default="pending")  # pending, in_progress, completed

    measurement = relationship("Measurement", back_populates="piece")
    assignments = relationship("Assignment", back_populates="piece")
    

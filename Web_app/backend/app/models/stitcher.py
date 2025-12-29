from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.database import Base

class Stitcher(Base):
    __tablename__ = "stitchers"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"))
    name = Column(String, nullable=False)
    phone = Column(String)

    shop = relationship("Shop", back_populates="stitchers")
    assignments = relationship("Assignment", back_populates="stitcher")

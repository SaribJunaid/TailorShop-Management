from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from Web_app.backend.app.models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"))
    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # OWNER | STAFF
    is_active = Column(Boolean, default=True)

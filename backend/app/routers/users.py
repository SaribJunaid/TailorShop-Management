from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import user, shop
from app.models.database import get_db
from app.core.security import hash_password

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def create_user(shop_id: int, name: str, username: str, password: str, role: str, db: Session = Depends(get_db)):
    shop_obj = db.query(shop.Shop).filter(shop.Shop.id == shop_id).first()
    if not shop_obj:
        raise HTTPException(status_code=404, detail="Shop not found")

    hashed_password = hash_password(password)
    new_user = user.User(shop_id=shop_id, name=name, username=username, password_hash=hashed_password, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(user.User).all()

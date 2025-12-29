from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import shop
from app.models.database import get_db

router = APIRouter(prefix="/shops", tags=["Shops"])

@router.post("/")
def create_shop(name: str, phone: str = None, address: str = None, db: Session = Depends(get_db)):
    new_shop = shop.Shop(name=name, phone=phone, address=address)
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)
    return new_shop

@router.get("/")
def get_shops(db: Session = Depends(get_db)):
    return db.query(shop.Shop).all()

@router.get("/{shop_id}")
def get_shop(shop_id: int, db: Session = Depends(get_db)):
    shop_obj = db.query(shop.Shop).filter(shop.Shop.id == shop_id).first()
    if not shop_obj:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop_obj

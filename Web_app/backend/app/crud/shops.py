from sqlalchemy.orm import Session
from app.models.shop import Shop
from app.schemas.shop import ShopCreate, ShopUpdate

def get_shop(db: Session, shop_id: int):
    return db.query(Shop).filter(Shop.id == shop_id).first()

def get_shops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Shop).offset(skip).limit(limit).all()

def create_shop(db: Session, shop: ShopCreate):
    db_shop = Shop(**shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

def update_shop(db: Session, db_shop: Shop, updates: ShopUpdate):
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_shop, key, value)
    db.commit()
    db.refresh(db_shop)
    return db_shop

def delete_shop(db: Session, db_shop: Shop):
    db.delete(db_shop)
    db.commit()

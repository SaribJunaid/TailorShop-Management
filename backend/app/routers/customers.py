from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import customer, shop
from app.models.database import get_db

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("/")
def create_customer(shop_id: int, name: str, phone: str = None, email: str = None, db: Session = Depends(get_db)):
    shop_obj = db.query(shop.Shop).filter(shop.Shop.id == shop_id).first()
    if not shop_obj:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    new_customer = customer.Customer(shop_id=shop_id, name=name, phone=phone, email=email)
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.get("/")
def get_customers(db: Session = Depends(get_db)):
    return db.query(customer.Customer).all()

@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    cust = db.query(customer.Customer).filter(customer.Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    return cust

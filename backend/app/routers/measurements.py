from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import measurement, customer, shop
from app.models.database import get_db

router = APIRouter(prefix="/measurements", tags=["Measurements"])

@router.post("/")
def add_measurement(customer_id: int, shop_id: int, description: str = None, advance_payment: float = 0, remaining_amount: float = 0, db: Session = Depends(get_db)):
    cust = db.query(customer.Customer).filter(customer.Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    shop_obj = db.query(shop.Shop).filter(shop.Shop.id == shop_id).first()
    if not shop_obj:
        raise HTTPException(status_code=404, detail="Shop not found")

    new_measurement = measurement.Measurement(
        customer_id=customer_id,
        shop_id=shop_id,
        description=description,
        advance_payment=advance_payment,
        remaining_amount=remaining_amount
    )
    db.add(new_measurement)
    db.commit()
    db.refresh(new_measurement)
    return new_measurement

@router.get("/")
def get_measurements(db: Session = Depends(get_db)):
    return db.query(measurement.Measurement).all()

@router.get("/{measurement_id}")
def get_measurement(measurement_id: int, db: Session = Depends(get_db)):
    meas = db.query(measurement.Measurement).filter(measurement.Measurement.id == measurement_id).first()
    if not meas:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return meas

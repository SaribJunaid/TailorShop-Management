from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.customer import CustomerCreate, CustomerRead, CustomerUpdate
from app.crud import customers as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.post("/", response_model=CustomerRead)
def create_customer_endpoint(customer: CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer_endpoint(customer_id: int, db: Session = Depends(get_db)):
    db_customer = crud.get_customer(db, customer_id)
    return db_customer

@router.get("/", response_model=list[CustomerRead])
def list_customers_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_customers(db, skip, limit)

@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer_endpoint(customer_id: int, updates: CustomerUpdate, db: Session = Depends(get_db)):
    db_customer = crud.get_customer(db, customer_id)
    return crud.update_customer(db, db_customer, updates)

@router.delete("/{customer_id}")
def delete_customer_endpoint(customer_id: int, db: Session = Depends(get_db)):
    db_customer = crud.get_customer(db, customer_id)
    crud.delete_customer(db, db_customer)
    return {"detail": "Customer deleted"}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import or_

from app.models.database import get_db
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerRead, CustomerUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("/", response_model=CustomerRead)
def create_customer(
    customer_in: CustomerCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a customer linked automatically to the logged-in user's shop."""
    new_customer = Customer(
        **customer_in.model_dump(),
        shop_id=current_user.shop_id  # Forced security: user can't pick the shop
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.get("/", response_model=List[CustomerRead])
def list_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List only the customers belonging to the logged-in user's shop."""
    return db.query(Customer).filter(Customer.shop_id == current_user.shop_id).all()

@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id, 
        Customer.shop_id == current_user.shop_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.get("/search/", response_model=List[CustomerRead])
def search_customers(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search for customers by name or phone number within the user's shop.
    Example: /customers/search/?query=92300
    """
    if len(query) < 3:
        raise HTTPException(
            status_code=400, 
            detail="Search query must be at least 3 characters long"
        )

    # We use 'or_' to check both fields
    # % is a wildcard. '%abc%' matches any string containing 'abc'
    search_filter = f"%{query}%"
    
    results = db.query(Customer).filter(
        Customer.shop_id == current_user.shop_id,
        or_(
            Customer.name.ilike(search_filter),
            Customer.phone.ilike(search_filter)
        )
    ).limit(10).all() # Limit to 10 for performance

    return results

@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(
    customer_id: int,
    customer_in: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer_query = db.query(Customer).filter(
        Customer.id == customer_id, 
        Customer.shop_id == current_user.shop_id
    )
    customer = customer_query.first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Update only the fields provided in the request
    update_data = customer_in.model_dump(exclude_unset=True)
    customer_query.update(update_data)
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a customer and their associated records."""
    customer = db.query(Customer).filter(
        Customer.id == customer_id, 
        Customer.shop_id == current_user.shop_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}
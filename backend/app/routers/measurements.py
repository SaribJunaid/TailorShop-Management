from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db
from app.models.measurement import Measurement
from app.models.customer import Customer
from app.models.user import User
from app.schemas.measurement import MeasurementCreate, MeasurementRead, MeasurementUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/measurements", tags=["Measurements"])

@router.post("/", response_model=MeasurementRead)
def create_measurement(
    m_in: MeasurementCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify that the customer exists and belongs to this shop
    customer = db.query(Customer).filter(
        Customer.id == m_in.customer_id, 
        Customer.shop_id == current_user.shop_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=404, 
            detail="Customer not found in your shop. Cannot create measurement."
        )

    # 2. Create the measurement profile
    new_measurement = Measurement(
        **m_in.model_dump(),
        shop_id=current_user.shop_id
    )
    db.add(new_measurement)
    db.commit()
    db.refresh(new_measurement)
    return new_measurement

@router.get("/customer/{customer_id}", response_model=List[MeasurementRead])
def get_customer_measurements(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all historical measurement profiles for a specific customer."""
    return db.query(Measurement).filter(
        Measurement.customer_id == customer_id,
        Measurement.shop_id == current_user.shop_id
    ).all()

@router.put("/{measurement_id}", response_model=MeasurementRead)
def update_measurement(
    measurement_id: int,
    m_in: MeasurementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    m_query = db.query(Measurement).filter(
        Measurement.id == measurement_id, 
        Measurement.shop_id == current_user.shop_id
    )
    measurement = m_query.first()
    
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement record not found")
    
    update_data = m_in.model_dump(exclude_unset=True)
    m_query.update(update_data)
    db.commit()
    db.refresh(measurement)
    return measurement
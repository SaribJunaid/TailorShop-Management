from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models import measurement as measurement_model
from app.schemas import measurement as measurement_schema
from app.models.database import get_db

router = APIRouter(
    prefix="/measurements",
    tags=["Measurements"]
)

# Create a new measurement
@router.post("/", response_model=measurement_schema.MeasurementOut)
def create_measurement(measurement: measurement_schema.MeasurementCreate, db: Session = Depends(get_db)):
    db_measurement = measurement_model.Measurement(**measurement.dict())
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

# Get all measurements
@router.get("/", response_model=List[measurement_schema.MeasurementOut])
def get_measurements(db: Session = Depends(get_db)):
    return db.query(measurement_model.Measurement).all()

# Get a single measurement by ID
@router.get("/{measurement_id}", response_model=measurement_schema.MeasurementOut)
def get_measurement(measurement_id: int, db: Session = Depends(get_db)):
    db_measurement = db.query(measurement_model.Measurement).filter(measurement_model.Measurement.id == measurement_id).first()
    if not db_measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return db_measurement

# Update a measurement
@router.put("/{measurement_id}", response_model=measurement_schema.MeasurementOut)
def update_measurement(measurement_id: int, measurement: measurement_schema.MeasurementUpdate, db: Session = Depends(get_db)):
    db_measurement = db.query(measurement_model.Measurement).filter(measurement_model.Measurement.id == measurement_id).first()
    if not db_measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    for key, value in measurement.dict(exclude_unset=True).items():
        setattr(db_measurement, key, value)
    
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

# Delete a measurement
@router.delete("/{measurement_id}")
def delete_measurement(measurement_id: int, db: Session = Depends(get_db)):
    db_measurement = db.query(measurement_model.Measurement).filter(measurement_model.Measurement.id == measurement_id).first()
    if not db_measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    db.delete(db_measurement)
    db.commit()
    return {"detail": "Measurement deleted successfully"}

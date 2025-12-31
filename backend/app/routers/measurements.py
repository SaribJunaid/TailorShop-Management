from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.measurement import MeasurementCreate, MeasurementRead, MeasurementUpdate
from app.crud import measurements as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/measurements",
    tags=["measurements"]
)

@router.post("/", response_model=MeasurementRead)
def create_measurement_endpoint(measurement: MeasurementCreate, db: Session = Depends(get_db)):
    return crud.create_measurement(db, measurement)

@router.get("/{measurement_id}", response_model=MeasurementRead)
def get_measurement_endpoint(measurement_id: int, db: Session = Depends(get_db)):
    return crud.get_measurement(db, measurement_id)

@router.get("/", response_model=list[MeasurementRead])
def list_measurements_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_measurements(db, skip, limit)

@router.put("/{measurement_id}", response_model=MeasurementRead)
def update_measurement_endpoint(measurement_id: int, updates: MeasurementUpdate, db: Session = Depends(get_db)):
    db_measurement = crud.get_measurement(db, measurement_id)
    return crud.update_measurement(db, db_measurement, updates)

@router.delete("/{measurement_id}")
def delete_measurement_endpoint(measurement_id: int, db: Session = Depends(get_db)):
    db_measurement = crud.get_measurement(db, measurement_id)
    crud.delete_measurement(db, db_measurement)
    return {"detail": "Measurement deleted"}

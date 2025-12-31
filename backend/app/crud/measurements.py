from sqlalchemy.orm import Session
from app.models.measurement import Measurement
from app.schemas.measurement import MeasurementCreate, MeasurementUpdate

def get_measurement(db: Session, measurement_id: int):
    return db.query(Measurement).filter(Measurement.id == measurement_id).first()

def get_measurements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Measurement).offset(skip).limit(limit).all()

def create_measurement(db: Session, measurement: MeasurementCreate):
    db_measurement = Measurement(**measurement.dict())
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

def update_measurement(db: Session, db_measurement: Measurement, updates: MeasurementUpdate):
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_measurement, key, value)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

def delete_measurement(db: Session, db_measurement: Measurement):
    db.delete(db_measurement)
    db.commit()

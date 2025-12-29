from sqlalchemy.orm import Session
from app.models.assignment import Assignment
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate

def get_assignment(db: Session, assignment_id: int):
    return db.query(Assignment).filter(Assignment.id == assignment_id).first()

def get_assignments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Assignment).offset(skip).limit(limit).all()

def create_assignment(db: Session, assignment: AssignmentCreate):
    db_assignment = Assignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def update_assignment(db: Session, db_assignment: Assignment, updates: AssignmentUpdate):
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_assignment, key, value)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def delete_assignment(db: Session, db_assignment: Assignment):
    db.delete(db_assignment)
    db.commit()

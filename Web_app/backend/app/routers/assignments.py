from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.assignment import AssignmentCreate, AssignmentRead, AssignmentUpdate
from app.crud import assignments as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/assignments",
    tags=["assignments"]
)

@router.post("/", response_model=AssignmentRead)
def create_assignment_endpoint(assignment: AssignmentCreate, db: Session = Depends(get_db)):
    return crud.create_assignment(db, assignment)

@router.get("/{assignment_id}", response_model=AssignmentRead)
def get_assignment_endpoint(assignment_id: int, db: Session = Depends(get_db)):
    return crud.get_assignment(db, assignment_id)

@router.get("/", response_model=list[AssignmentRead])
def list_assignments_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_assignments(db, skip, limit)

@router.put("/{assignment_id}", response_model=AssignmentRead)
def update_assignment_endpoint(assignment_id: int, updates: AssignmentUpdate, db: Session = Depends(get_db)):
    db_assignment = crud.get_assignment(db, assignment_id)
    return crud.update_assignment(db, db_assignment, updates)

@router.delete("/{assignment_id}")
def delete_assignment_endpoint(assignment_id: int, db: Session = Depends(get_db)):
    db_assignment = crud.get_assignment(db, assignment_id)
    crud.delete_assignment(db, db_assignment)
    return {"detail": "Assignment deleted"}

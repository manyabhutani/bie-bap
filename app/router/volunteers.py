from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.volunteer import VolunteerCreate, VolunteerRead
from app.services.volunteer_service import (
    create_volunteer,
    get_all_volunteers,
    get_volunteer_by_id,
    update_volunteer,
    delete_volunteer
)
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=VolunteerRead, status_code=status.HTTP_201_CREATED)
def create_volunteer_endpoint(volunteer_data: VolunteerCreate, db: Session = Depends(get_db)):
    new_volunteer = create_volunteer(db, volunteer_data)
    if new_volunteer is None:
        raise HTTPException(status_code=400, detail="Volunteer with this email already exists")
    return new_volunteer

@router.get("/", response_model=List[VolunteerRead])
def get_volunteers_endpoint(db: Session = Depends(get_db)):
    return get_all_volunteers(db)

@router.get("/{volunteer_id}", response_model=VolunteerRead)
def get_volunteer_endpoint(volunteer_id: int, db: Session = Depends(get_db)):
    volunteer = get_volunteer_by_id(db, volunteer_id)
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return volunteer

@router.put("/{volunteer_id}", response_model=VolunteerRead)
def update_volunteer_endpoint(volunteer_id: int, volunteer_data: VolunteerCreate, db: Session = Depends(get_db)):
    updated_volunteer = update_volunteer(db, volunteer_id, volunteer_data)
    if not updated_volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return updated_volunteer

@router.delete("/{volunteer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_volunteer_endpoint(volunteer_id: int, db: Session = Depends(get_db)):
    if not delete_volunteer(db, volunteer_id):
        raise HTTPException(status_code=404, detail="Volunteer not found")

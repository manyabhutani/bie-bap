from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.volunteers import VolunteerCreate, VolunteerUpdate , VolunteerBase , VolunteerRead
from app.services.volunteer_service import (
    get_volunteer_by_user_id,
    update_volunteer,
    register_volunteer_for_event
)
from app.db.session import get_db
from app.auth.security import get_current_user

from app.db.models.volunteer import Volunteer

from app.services.volunteer_service import get_volunteer_events

router = APIRouter()

@router.get("/me", response_model=VolunteerBase)
def get_my_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer profile not found")
    return volunteer

@router.put("/me", response_model=VolunteerRead)
def update_my_profile(update_data: VolunteerUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer profile not found")
    updated_volunteer = update_volunteer(db, volunteer.id, update_data)
    if not updated_volunteer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Update failed")
    return updated_volunteer




@router.get("/me/events")
def get_my_events(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    return get_volunteer_events(db, volunteer.id)

@router.get("/", response_model=List[VolunteerRead])
def get_all_volunteers(db: Session = Depends(get_db)):
    volunteers = db.query(Volunteer).all()
    return volunteers

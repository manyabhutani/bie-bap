from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.volunteers import VolunteerCreate, VolunteerUpdate , VolunteerBase , VolunteerRead
from app.services.volunteer_service import (
    get_volunteer_by_user_id,
    update_volunteer,

    add_skill_to_volunteer,
    remove_skill_from_volunteer,
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

@router.post("/me/skills/{skill_id}", response_model=VolunteerRead)
def add_skill(skill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer profile not found")
    volunteer = add_skill_to_volunteer(db, volunteer.id, skill_id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not add skill")
    return volunteer

@router.delete("/me/skills/{skill_id}", response_model=VolunteerRead)
def remove_skill(skill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer profile not found")
    volunteer = remove_skill_from_volunteer(db, volunteer.id, skill_id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not remove skill")
    return volunteer

@router.post("/events/{event_id}/signup")
def signup_for_event(event_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer profile not found")
    result = register_volunteer_for_event(db, volunteer.id, event_id)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result

@router.get("/volunteers/me/events")
def get_my_events(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    volunteer = get_volunteer_by_user_id(db, current_user.id)
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    return get_volunteer_events(db, volunteer.id)
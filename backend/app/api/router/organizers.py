from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.organizers import OrganizerRead, OrganizerUpdate, OrganizerCreate
from app.services.organizer_service import get_organizer_by_user_id, update_organizer, create_organizer
from app.db.session import get_db
from app.auth.security import get_current_user, organizer_required
from typing import List
from app.db.models.event import Event

from app.schemas.volunteers import VolunteerRead

from app.db.models.associations import volunteer_events

router = APIRouter()

@router.get("/me", response_model=OrganizerRead)
def get_my_organizer_profile(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    organizer = get_organizer_by_user_id(db, current_user.id)
    if not organizer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")
    return organizer

@router.put("/me", response_model=OrganizerRead)
def update_my_organizer_profile(
        update_data: OrganizerUpdate,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    organizer = get_organizer_by_user_id(db, current_user.id)
    if not organizer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")
    updated_organizer = update_organizer(db, organizer.id, update_data)
    if not updated_organizer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Update failed")
    return updated_organizer
@router.get("/{event_id}/volunteers", response_model=List[VolunteerRead])
def get_event_volunteers(event_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    event = db.query(Event).filter(Event.id == event_id, Event.organizer_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found or you are not the organizer")

    return event.volunteers


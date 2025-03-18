from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.events import EventCreate, EventRead, EventUpdate
from app.services.event_service import create_event, get_all_events, get_event_by_id, update_event, delete_event
from app.db.session import get_db
from app.auth.security import organizer_required , get_current_user
from app.db.models.volunteer import Volunteer
from app.db.models.event import Event

from app.services.organizer_service import get_organizer_by_user_id

router = APIRouter()

@router.post("/", response_model=EventRead, status_code=status.HTTP_201_CREATED)
def create_event_endpoint(event_data: EventCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    organizer = get_organizer_by_user_id(db, current_user.id)
    if organizer is None:
        raise HTTPException(status_code=403, detail="User is not an organizer")
    new_event = create_event(db, event_data, organizer.id)
    return new_event

@router.get("/", response_model=List[EventRead])
def get_events_endpoint(db: Session = Depends(get_db)):
    events = get_all_events(db)
    return events

@router.get("/{event_id}", response_model=EventRead)
def get_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    event = get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventRead, dependencies=[Depends(organizer_required)])
def update_event_endpoint(event_id: int, event_data: EventUpdate, db: Session = Depends(get_db)):
    event = update_event(db, event_id, event_data)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(organizer_required)])
def delete_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    if not delete_event(db, event_id):
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

@router.put("/{event_id}/volunteers/{volunteer_id}/status" , dependencies=[Depends(organizer_required)])
def update_volunteer_registration_status(
        event_id: int,
        volunteer_id: int,
        new_status: str,
        db: Session = Depends(get_db),
):
    allowed_statuses = {"registered", "accepted", "rejected", "cancelled", "attended"}
    if new_status not in allowed_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")
    success = update_volunteer_status(db, event_id, volunteer_id, new_status)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer registration not found")
    return {"message": "Volunteer registration status updated"}


@router.post("/{event_id}/signup", status_code=status.HTTP_200_OK)
def signup_for_event(event_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != "volunteer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only volunteers can sign up for events")

    volunteer = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer profile not found")

    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if volunteer in event.volunteers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already signed up for this event")

    if event.max_volunteers and len(event.volunteers) >= event.max_volunteers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event is full")

    event.volunteers.append(volunteer)
    db.commit()
    return {"message": "Successfully signed up for the event"}
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.events import EventCreate, EventRead, EventUpdate
from app.services.event_service import create_event, get_all_events, get_event_by_id, update_event, delete_event
from app.db.session import get_db
from app.auth.security import organiser_required

router = APIRouter()

@router.post("/", response_model=EventRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(organiser_required)])
def create_event_endpoint(event_data: EventCreate, db: Session = Depends(get_db)):
    new_event = create_event(db, event_data)
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

@router.put("/{event_id}", response_model=EventRead, dependencies=[Depends(organiser_required)])
def update_event_endpoint(event_id: int, event_data: EventUpdate, db: Session = Depends(get_db)):
    event = update_event(db, event_id, event_data)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(organiser_required)])
def delete_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    if not delete_event(db, event_id):
        raise HTTPException(status_code=404, detail="Event not found")
@router.put("/{event_id}/volunteers/{volunteer_id}/status" , dependencies=[Depends(organiser_required)])
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
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.event import EventCreate, EventRead
from app.services.event_service import (
    create_event,
    get_all_events,
    get_event_by_id,
    update_event,
    delete_event
)
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=EventRead, status_code=status.HTTP_201_CREATED)
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

@router.put("/{event_id}", response_model=EventRead)
def update_event_endpoint(event_id: int, event_data: EventCreate, db: Session = Depends(get_db)):
    updated_event = update_event(db, event_id, event_data)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event_endpoint(event_id: int, db: Session = Depends(get_db)):
    if not delete_event(db, event_id):
        raise HTTPException(status_code=404, detail="Event not found")

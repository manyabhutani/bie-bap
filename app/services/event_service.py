from sqlalchemy.orm import Session
from app.models.event import Event
from app.schemas.event import EventCreate
from typing import List, Optional

def create_event(db: Session, event_data: EventCreate) -> Event:
    new_event = Event(
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        location=event_data.location,
        required_skills=event_data.required_skills
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def get_all_events(db: Session) -> List[Event]:
    return db.query(Event).all()

def get_event_by_id(db: Session, event_id: int) -> Optional[Event]:
    return db.query(Event).filter(Event.id == event_id).first()

def update_event(db: Session, event_id: int, event_data: EventCreate) -> Optional[Event]:
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return None
    event.title = event_data.title
    event.description = event_data.description
    event.date = event_data.date
    event.location = event_data.location
    event.required_skills = event_data.required_skills
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event_id: int) -> bool:
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True

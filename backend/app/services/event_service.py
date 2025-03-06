
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.event import Event
from app.models.skill import Skill
from app.schemas.event import EventCreate

def create_event(db: Session, event_data: EventCreate) -> Event:
    new_event = Event(
        title=event_data.title,
        description=event_data.description,
        location=event_data.location,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        organizer_id=event_data.organizer_id,
        max_volunteers=event_data.max_volunteers
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    if event_data.required_skill_ids:
        required_skills = db.query(Skill).filter(Skill.id.in_(event_data.required_skill_ids)).all()
        new_event.required_skills = required_skills
        db.commit()
        db.refresh(new_event)

    return new_event

def get_all_events(db: Session) -> List[Event]:
    return db.query(Event).all()

def get_event_by_id(db: Session, event_id: int) -> Optional[Event]:
    return db.query(Event).filter(Event.id == event_id).first()

def update_event(db: Session, event_id: int, event_data: EventUpdate) -> Optional[Event]:
    event = get_event_by_id(db, event_id)
    if not event:
        return None

    update_data = event_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event_id: int) -> bool:
    event = get_event_by_id(db, event_id)
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True

from sqlalchemy.orm import Session
from typing import Optional, List
from app.db.models.volunteer import Volunteer
from app.db.models.event import Event
from app.schemas.volunteers import VolunteerCreate, VolunteerUpdate

from app.db.models.associations import volunteer_events


def get_volunteer_by_user_id(db: Session, user_id: int) -> Optional[Volunteer]:
    return db.query(Volunteer).filter(Volunteer.user_id == user_id).first()

def update_volunteer(db: Session, volunteer_id: int, update_data: VolunteerUpdate) -> Optional[Volunteer]:
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if volunteer:
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(volunteer, key, value)
        db.commit()
        db.refresh(volunteer)
    return volunteer


def register_volunteer_for_event(db: Session, volunteer_id: int, event_id: int) -> dict:
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return {"error": "Event not found"}
    if len(event.volunteers) >= event.max_volunteers:
        return {"error": "Event is full"}
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if volunteer in event.volunteers:
        return {"error": "Already registered"}
    event.volunteers.append(volunteer)
    db.commit()
    db.refresh(event)
    return {"message": "Volunteer registered successfully", "event_id": event.id, "volunteer_id": volunteer.id}


def get_volunteer_events(db: Session, volunteer_id: int):
    results = (
        db.query(Event.id, Event.title, Event.description, Event.start_time, Event.location, volunteer_events.c.status,
                 Event.end_time)
        .join(volunteer_events, Event.id == volunteer_events.c.event_id)
        .filter(volunteer_events.c.volunteer_id == volunteer_id)
        .all()
    )
    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "start_time": r.start_time,
            "end_time": r.end_time,
            "location": r.location

        }
        for r in results
    ]

def delete_volunteer(db: Session, volunteer_id: int):
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not volunteer:
        return None
    user = volunteer.user
    db.delete(volunteer)
    if user:
        db.delete(user)
    db.commit()
    return volunteer


from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models.event import Event
from app.schemas.events import EventCreate , EventUpdate

from app.db.models.associations import volunteer_events
from  app.db.models.volunteer import Volunteer

from app.services.whatsapp_service import send_whatsapp_message


def create_event(db: Session, event_data: EventCreate, organizer_id: int) -> Event:
    new_event = Event(
        title=event_data.title,
        description=event_data.description,
        location=event_data.location,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        organizer_id=organizer_id,
        max_volunteers=event_data.max_volunteers
    )

    db.add(new_event)
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


def get_event_volunteers(db: Session, event_id: int):
    results = (
        db.query(Volunteer.id, Volunteer.first_name, Volunteer.last_name, volunteer_events.c.status)
        .join(volunteer_events, Volunteer.id == volunteer_events.c.volunteer_id)
        .filter(volunteer_events.c.event_id == event_id)
        .all()
    )

    return [{"id": v.id, "name": f"{v.first_name} {v.last_name}", "status": v.status} for v in results]



def assign_volunteers_to_event(db: Session, event_id: int, volunteer_ids: List[int]):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return None, "Event not found"

    volunteers = db.query(Volunteer).filter(Volunteer.id.in_(volunteer_ids)).all()
    if len(volunteers) != len(volunteer_ids):
        return None, "Some volunteer IDs are invalid"

    event.volunteers = volunteers
    db.commit()
    db.refresh(event)

    #whatsap notification

    for volunteer in volunteers:
        message = (
            f"Hello {volunteer.first_name},\n"
            f"You have been assigned to the event: {event.title}\n"
            # f"Date: {event.date} at {event.time}\n"
            f"Location: {event.location}\n"
            "Please confirm your availability."
        )
        send_whatsapp_message(volunteer.phone, message)

    return event, None


def get_assigned_events_for_volunteer(db: Session, volunteer_id: int):
    return db.query(Event).join(volunteer_events).filter(volunteer_events.c.volunteer_id == volunteer_id).all()
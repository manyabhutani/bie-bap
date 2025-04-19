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


from app.services.event_service import assign_volunteers_to_event, get_assigned_events_for_volunteer

from app.schemas.events import VolunteerAssignRequest

from app.services.event_service import send_custom_message_to_event_volunteers

from app.schemas.message import CustomNotificationRequest

from app.services.event_service import send_reminders_to_all_events

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

@router.post("/{event_id}/assign", response_model=EventRead)
def assign_volunteers(
        event_id: int,
        request: VolunteerAssignRequest,
        db: Session = Depends(get_db),
        current_user=Depends(get_current_user),
):
    event, error = assign_volunteers_to_event(db, event_id, request.volunteer_ids)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return event

@router.get("/volunteers/me/events", response_model=List[EventRead])
def get_my_events(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_assigned_events_for_volunteer(db, current_user.id)


@router.post("/{event_id}/notify" )
def notify_event_volunteers(event_id: int, req: CustomNotificationRequest, db: Session = Depends(get_db)):
    return send_custom_message_to_event_volunteers(db, event_id, req.message)
@router.post("/notify_all")
def notify_all_events(db: Session = Depends(get_db)):
    result = send_reminders_to_all_events(db)

    if not result["success_count"]:
        raise HTTPException(status_code=400, detail="No reminders were sent.")

    return result

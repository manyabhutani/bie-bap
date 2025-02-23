from sqlalchemy.orm import Session
from app.models.volunteer import Volunteer
from app.schemas.volunteer import VolunteerCreate
from typing import List, Optional

def create_volunteer(db: Session, volunteer_data: VolunteerCreate) -> Volunteer:
    existing = db.query(Volunteer).filter(Volunteer.email == volunteer_data.email).first()
    if existing:
        return None
    new_volunteer = Volunteer(
        name=volunteer_data.name,
        email=volunteer_data.email,
        phone_number=volunteer_data.phone_number,
        skills=volunteer_data.skills,
        availability=volunteer_data.availability
    )
    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)
    return new_volunteer

def get_all_volunteers(db: Session) -> List[Volunteer]:
    return db.query(Volunteer).all()

def get_volunteer_by_id(db: Session, volunteer_id: int) -> Optional[Volunteer]:
    return db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()

def update_volunteer(db: Session, volunteer_id: int, volunteer_data: VolunteerCreate) -> Optional[Volunteer]:
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not volunteer:
        return None
    volunteer.name = volunteer_data.name
    volunteer.email = volunteer_data.email
    volunteer.phone_number = volunteer_data.phone_number
    volunteer.skills = volunteer_data.skills
    volunteer.availability = volunteer_data.availability
    db.commit()
    db.refresh(volunteer)
    return volunteer

def delete_volunteer(db: Session, volunteer_id: int) -> bool:
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not volunteer:
        return False
    db.delete(volunteer)
    db.commit()
    return True

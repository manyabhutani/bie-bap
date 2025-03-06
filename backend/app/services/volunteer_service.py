from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.volunteer import Volunteer
from app.models.skill import Skill
from app.schemas.volunteer import VolunteerCreate, VolunteerUpdate

def create_volunteer(db: Session, volunteer_data: VolunteerCreate) -> Volunteer:
    new_volunteer = Volunteer(
        user_id=volunteer_data.user_id,
        first_name=volunteer_data.first_name,
        last_name=volunteer_data.last_name,
        phone=volunteer_data.phone,
        bio=volunteer_data.bio,
        availability=volunteer_data.availability,
        location=volunteer_data.location,
        whatsapp_opt_in=volunteer_data.whatsapp_opt_in
    )
    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)
    return new_volunteer

def get_all_volunteers(db: Session) -> List[Volunteer]:
    return db.query(Volunteer).all()

def get_volunteer_by_id(db: Session, volunteer_id: int) -> Optional[Volunteer]:
    return db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()

def update_volunteer(db: Session, volunteer_id: int, update_data: VolunteerUpdate) -> Optional[Volunteer]:
    volunteer = get_volunteer_by_id(db, volunteer_id)
    if volunteer:
        for attr, value in update_data.dict(exclude_unset=True).items():
            setattr(volunteer, attr, value)
        db.commit()
        db.refresh(volunteer)
    return volunteer

def delete_volunteer(db: Session, volunteer_id: int) -> bool:
    volunteer = get_volunteer_by_id(db, volunteer_id)
    if volunteer:
        db.delete(volunteer)
        db.commit()
        return True
    return False


def add_skill_to_volunteer(db: Session, volunteer_id: int, skill_id: int) -> Optional[Volunteer]:
    """
    Adds a skill to a volunteer's profile if it doesn't already exist.
    """
    volunteer = get_volunteer_by_id(db, volunteer_id)
    if not volunteer:
        return None

    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        return None
    if skill not in volunteer.skills:
        volunteer.skills.append(skill)
        db.commit()
        db.refresh(volunteer)
    return volunteer

def remove_skill_from_volunteer(db: Session, volunteer_id: int, skill_id: int) -> Optional[Volunteer]:

    volunteer = get_volunteer_by_id(db, volunteer_id)
    if not volunteer:
        return None

    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        return None

    if skill in volunteer.skills:
        volunteer.skills.remove(skill)
        db.commit()
        db.refresh(volunteer)
    return volunteer

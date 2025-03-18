from sqlalchemy.orm import Session
from typing import Optional
from app.db.models.organizer import Organizer
from app.schemas.organizers import OrganizerCreate, OrganizerUpdate

def get_organizer_by_user_id(db: Session, user_id: int) -> Optional[Organizer]:
    return db.query(Organizer).filter(Organizer.user_id == user_id).first()

def update_organizer(db: Session, organizer_id: int, update_data: OrganizerUpdate) -> Optional[Organizer]:

    organizer = db.query(Organizer).filter(Organizer.id == organizer_id).first()
    if not organizer:
        return None
    update_dict = update_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(organizer, key, value)
    db.commit()
    db.refresh(organizer)
    return organizer

def create_organizer(db: Session, organizer_data: OrganizerCreate) -> Organizer:
    new_organizer = Organizer(
        user_id=organizer_data.user_id,
        organization_name=organizer_data.organization_name,
        description=organizer_data.description,
        phone=organizer_data.phone,
        address=organizer_data.address
    )
    db.add(new_organizer)
    db.commit()
    db.refresh(new_organizer)
    return new_organizer

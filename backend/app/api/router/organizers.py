from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.organizers import OrganizerRead, OrganizerUpdate, OrganizerCreate
from app.services.organizer_service import get_organizer_by_user_id, update_organizer, create_organizer
from app.db.session import get_db
from app.auth.security import get_current_user, organiser_required

router = APIRouter()

@router.get("/me", response_model=OrganizerRead)
def get_my_organizer_profile(
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    organizer = get_organizer_by_user_id(db, current_user.id)
    if not organizer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")
    return organizer

@router.put("/me", response_model=OrganizerRead)
def update_my_organizer_profile(
        update_data: OrganizerUpdate,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    organizer = get_organizer_by_user_id(db, current_user.id)
    if not organizer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")
    updated_organizer = update_organizer(db, organizer.id, update_data)
    if not updated_organizer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Update failed")
    return updated_organizer

# Optional
@router.post("/", response_model=OrganizerRead, status_code=status.HTTP_201_CREATED)
def create_organizer_profile(
        organizer_data: OrganizerCreate,
        db: Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    if current_user.role != "organiser":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only organisers can create an organiser profile."
        )

    if get_organizer_by_user_id(db, current_user.id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organizer profile already exists")
    new_organizer = create_organizer(db, organizer_data)
    return new_organizer

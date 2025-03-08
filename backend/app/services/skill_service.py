from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models.skill import Skill
from app.schemas.skill import SkillCreate

def create_skill(db: Session, skill_data: SkillCreate) -> Skill:
    new_skill = Skill(
        name=skill_data.name,
        description=skill_data.description
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

def get_all_skills(db: Session) -> List[Skill]:
    return db.query(Skill).all()

def get_skill_by_id(db: Session, skill_id: int) -> Optional[Skill]:
    return db.query(Skill).filter(Skill.id == skill_id).first()

def delete_skill(db: Session, skill_id: int) -> bool:
    skill = get_skill_by_id(db, skill_id)
    if not skill:
        return False
    db.delete(skill)
    db.commit()
    return True

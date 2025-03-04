from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import Base

class Organizer(Base):
    __tablename__ = "organizers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    organization_name = Column(String)
    description = Column(Text, nullable=True)
    phone = Column(String)
    address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="organizer")
    events = relationship("Event", back_populates="organizer")

    def __repr__(self):
        return f"<Organizer(id={self.id}, name={self.organization_name})>"
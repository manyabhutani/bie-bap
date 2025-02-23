
from sqlalchemy import Column, Integer, String, ARRAY
from app.database import Base

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    skills = Column(ARRAY(String))
    availability = Column(String, nullable=False)

from fastapi import FastAPI
from app.database import engine, Base
from app.models.volunteer import Volunteer

from app.router import volunteers , events , auth

app = FastAPI(title="Volunteer Management API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["auth"])

app.include_router(volunteers.router, prefix="/volunteers", tags=["volunteers"])

app.include_router(events.router, prefix="/events", tags=["events"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Volunteer Management API"}

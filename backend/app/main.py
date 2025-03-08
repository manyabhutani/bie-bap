from fastapi import FastAPI
from app.db.session import engine, Base
from app.api.router import auth, volunteers, events , organizers

app = FastAPI(title="Volunteer Management API")

Base.metadata.create_all(bind=engine)

app.router.include_router(auth.router, prefix="/auth", tags=["auth"])
app.router.include_router(volunteers.router, prefix="/volunteers", tags=["volunteers"])
app.router.include_router(organizers.router , prefix="/organizers" , tags=["organizers"])
app.router.include_router(events.router, prefix="/events", tags=["events"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Volunteer Management API"}

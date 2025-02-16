from fastapi import FastAPI

app = FastAPI(title="Volunteer Management API")

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base



if os.environ.get("RENDER") != "true":
    load_dotenv("app/.env")

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

#cache data
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

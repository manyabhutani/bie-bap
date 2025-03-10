import os
from dotenv import load_dotenv
load_dotenv("app/.env")



DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

class Settings:
    access_token_expire_minutes: int = 15
    refresh_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    algorithm: str = "HS256"

    class Config:
        env_file = "app/.env"

settings = Settings()




import os
from dotenv import load_dotenv
load_dotenv("app/.env")



DATABASE_URL = os.getenv("DATABASE_URL")


class Settings:

    # Keycloak configuration
    KEYCLOAK_SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL")
    KEYCLOAK_REALM_NAME = os.getenv("KEYCLOAK_REALM_NAME")
    KEYCLOAK_ADMIN_USER = os.getenv("KEYCLOAK_ADMIN_USER")
    KEYCLOAK_ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD")
    KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID")
    KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET")


settings = Settings()
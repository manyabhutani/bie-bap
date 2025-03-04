from keycloak import KeycloakOpenID
from app.config import settings

keycloak_openid = KeycloakOpenID(
    server_url=settings.KEYCLOAK_SERVER_URL,
    client_id=settings.KEYCLOAK_CLIENT_ID,
    client_secret=settings.KEYCLOAK_CLIENT_SECRET,
    realm_name=settings.KEYCLOAK_REALM_NAME
)

def authenticate_user(username, password):
    return keycloak_openid.token(username, password)

def decode_token(token):
    try:
        return keycloak_openid.decode_token(token, key=settings.KEYCLOAK_CLIENT_SECRET, options={"verify_signature": True, "verify_aud": True})
    except Exception as e:
        return None
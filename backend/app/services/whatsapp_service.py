from twilio.rest import Client
import os
from dotenv import load_dotenv

if os.environ.get("RENDER") != "true":
    load_dotenv("app/.env")

AUTH_TOKEN = os.getenv("WHATSAPP_AUTH")
USERNAME = os.getenv("WHATSAPP_USERNAME")


def send_whatsapp_message(to, message):
    client = Client(USERNAME, AUTH_TOKEN)
    client.messages.create(
        from_="whatsapp:+14155238886",
        body=message,
        to=f"whatsapp:{to}"
    )

from twilio.rest import Client

def send_whatsapp_message(to, message):
    client = Client('ACa5c73d0b23740399e41c3c634c05f78a', 'ccbff0a375f653fb297ccf0c08a4eda9')
    client.messages.create(
        from_="whatsapp:+14155238886",
        body=message,
        to=f"whatsapp:{to}"
    )

from pydantic import BaseModel , EmailStr
from typing import Optional

class UserSignup(BaseModel):
    name : str
    email :EmailStr
    password : str
    whatsapp_number : str
    role :Optional[str] = "volunteer"

    @classmethod
    def validate_role(cls , role):
        if role not in ("volunteer", "organiser"):
            raise ValueError("Role must be either 'volunteer' or 'organiser'")
        return role


class UserLogin (BaseModel):
    email: EmailStr
    password: str
    whatsapp_number: str

"""Authentication schemas."""
import uuid

from pydantic import BaseModel, EmailStr


class LoginRequestSchema(BaseModel):
    """Login request schema."""

    email: EmailStr
    password: str


class LoginResponseSchema(BaseModel):
    """Login response schema."""

    access_token: str
    token_type: str = "bearer"
    user_id: uuid.UUID
    tenant_id: uuid.UUID
    role: str


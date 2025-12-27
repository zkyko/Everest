"""Payment schemas."""
import uuid

from pydantic import BaseModel, ConfigDict


class CheckoutCreateSchema(BaseModel):
    """Schema for creating a checkout session."""

    order_id: uuid.UUID
    success_url: str
    cancel_url: str


class CheckoutResponseSchema(BaseModel):
    """Checkout session response schema."""

    checkout_url: str
    session_id: str


class PaymentSchema(BaseModel):
    """Payment schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    order_id: uuid.UUID
    stripe_session_id: str | None
    stripe_payment_intent_id: str | None
    amount: Decimal
    status: str


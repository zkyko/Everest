"""Payment status schemas for admin dashboard."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PaymentStatusResponseSchema(BaseModel):
    """Stripe payment status response."""

    connected: bool
    mode: str  # "test" or "live"
    last_payment_at: Optional[datetime]
    last_webhook_at: Optional[datetime]
    webhook_ok: bool


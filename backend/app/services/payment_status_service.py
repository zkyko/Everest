"""Payment status service for admin dashboard."""
import uuid
from datetime import datetime
from typing import Optional

import stripe
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.payment import Payment as PaymentModel, PaymentStatus

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


async def get_payment_status(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> dict:
    """
    Get Stripe payment status for a tenant.

    Args:
        db: Database session
        tenant_id: Tenant UUID

    Returns:
        Dictionary with payment status information
    """
    # Check if Stripe is connected (for MVP, always True as we use platform account)
    connected = True  # In future with Stripe Connect, check tenant.stripe_account_id

    # Determine mode from Stripe API key
    mode = "test" if "test" in settings.STRIPE_SECRET_KEY.lower() else "live"

    # Get last successful payment (using id descending as proxy for time)
    # Note: In production, you'd want a created_at field on Payment model
    result = await db.execute(
        select(PaymentModel)
        .where(PaymentModel.tenant_id == tenant_id)
        .where(PaymentModel.status == PaymentStatus.COMPLETED)
        .order_by(PaymentModel.id.desc())
    )
    last_payment = result.scalar_one_or_none()
    # For MVP, use None for timestamps (would need created_at field in Payment model)
    # In production, use: last_payment_at = last_payment.created_at if last_payment else None
    last_payment_at = None

    # Get last webhook received
    webhook_result = await db.execute(
        select(PaymentModel)
        .where(PaymentModel.tenant_id == tenant_id)
        .where(PaymentModel.stripe_session_id.isnot(None))
        .order_by(PaymentModel.id.desc())
    )
    last_webhook_payment = webhook_result.scalar_one_or_none()
    # For MVP, use None for timestamps
    # In production, use: last_webhook_at = last_webhook_payment.created_at if last_webhook_payment else None
    last_webhook_at = None

    # Check webhook health
    # For MVP, assume OK if we have any payments with stripe_session_id
    webhook_ok = last_webhook_payment is not None

    return {
        "connected": connected,
        "mode": mode,
        "last_payment_at": last_payment_at,
        "last_webhook_at": last_webhook_at,
        "webhook_ok": webhook_ok,
    }


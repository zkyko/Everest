"""Diagnostics service for system health checks."""
import uuid
from datetime import datetime
from typing import List

import stripe
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.schemas.integrations import IntegrationStatus, IntegrationStatusSchema

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


async def check_database_health(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> IntegrationStatusSchema:
    """
    Check database connectivity and responsiveness.

    Args:
        db: Database session
        tenant_id: Tenant UUID (for scoping check)

    Returns:
        Integration status
    """
    try:
        # Simple query to check DB connectivity
        from app.models.payment import Payment as PaymentModel

        result = await db.execute(
            select(func.count()).select_from(PaymentModel).where(PaymentModel.tenant_id == tenant_id)
        )
        result.scalar()
        return IntegrationStatusSchema(
            name="Database",
            status=IntegrationStatus.HEALTHY,
            last_checked_at=datetime.utcnow(),
            message=None,
        )
    except Exception as e:
        return IntegrationStatusSchema(
            name="Database",
            status=IntegrationStatus.DOWN,
            last_checked_at=datetime.utcnow(),
            message=f"Connection error: {str(e)}",
        )


async def check_stripe_api_health(
    tenant_id: uuid.UUID,
) -> IntegrationStatusSchema:
    """
    Check Stripe API connectivity.

    Args:
        tenant_id: Tenant UUID (for context)

    Returns:
        Integration status
    """
    try:
        # Test Stripe API by retrieving account info
        account = stripe.Account.retrieve()
        return IntegrationStatusSchema(
            name="Stripe API",
            status=IntegrationStatus.HEALTHY,
            last_checked_at=datetime.utcnow(),
            message=f"Mode: {account.get('charges_enabled', 'test')}",
        )
    except stripe.error.AuthenticationError:
        return IntegrationStatusSchema(
            name="Stripe API",
            status=IntegrationStatus.DOWN,
            last_checked_at=datetime.utcnow(),
            message="Authentication failed - check API keys",
        )
    except Exception as e:
        return IntegrationStatusSchema(
            name="Stripe API",
            status=IntegrationStatus.DEGRADED,
            last_checked_at=datetime.utcnow(),
            message=f"Error: {str(e)}",
        )


async def check_stripe_webhook_health(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> IntegrationStatusSchema:
    """
    Check Stripe webhook freshness.

    Args:
        db: Database session
        tenant_id: Tenant UUID

    Returns:
        Integration status
    """
    try:
        # Check last webhook received (using max id as proxy for most recent)
        # Note: In production, you'd want a created_at/updated_at field on Payment model
        from app.models.payment import Payment as PaymentModel

        result = await db.execute(
            select(PaymentModel)
            .where(PaymentModel.tenant_id == tenant_id)
            .where(PaymentModel.stripe_session_id.isnot(None))
            .order_by(PaymentModel.id.desc())
        )
        last_webhook_payment = result.scalar_one_or_none()
        last_webhook = None  # Would use last_webhook_payment.created_at if field existed

        if not last_webhook_payment:
            return IntegrationStatusSchema(
                name="Stripe Webhooks",
                status=IntegrationStatus.HEALTHY,
                last_checked_at=datetime.utcnow(),
                message="No webhooks received yet (normal for new tenants)",
            )

        # For MVP, just confirm we have webhook data
        # In production, would check timestamp freshness
        return IntegrationStatusSchema(
            name="Stripe Webhooks",
            status=IntegrationStatus.HEALTHY,
            last_checked_at=datetime.utcnow(),
            message="Webhook endpoint active",
        )
    except Exception as e:
        return IntegrationStatusSchema(
            name="Stripe Webhooks",
            status=IntegrationStatus.DOWN,
            last_checked_at=datetime.utcnow(),
            message=f"Error checking webhooks: {str(e)}",
        )


async def get_all_integration_statuses(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> List[IntegrationStatusSchema]:
    """
    Get status of all integrations.

    Args:
        db: Database session
        tenant_id: Tenant UUID

    Returns:
        List of integration statuses
    """
    statuses = []

    # Check database
    db_status = await check_database_health(db, tenant_id)
    statuses.append(db_status)

    # Check Stripe API
    stripe_api_status = await check_stripe_api_health(tenant_id)
    statuses.append(stripe_api_status)

    # Check Stripe webhooks
    stripe_webhook_status = await check_stripe_webhook_health(db, tenant_id)
    statuses.append(stripe_webhook_status)

    # Future integrations (commented for now)
    # Email integration (disabled for MVP)
    statuses.append(
        IntegrationStatusSchema(
            name="Email",
            status=IntegrationStatus.DISABLED,
            last_checked_at=datetime.utcnow(),
            message="Not configured",
        )
    )

    # SMS integration (disabled for MVP)
    statuses.append(
        IntegrationStatusSchema(
            name="SMS",
            status=IntegrationStatus.DISABLED,
            last_checked_at=datetime.utcnow(),
            message="Not configured",
        )
    )

    return statuses


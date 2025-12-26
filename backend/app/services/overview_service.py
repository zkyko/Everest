"""Overview service combining multiple metrics for admin dashboard."""
import uuid
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order
from app.models.payment import Payment as PaymentModel, PaymentStatus
from app.schemas.overview import OverviewMetricsSchema
from app.services.volume_service import calculate_volume_metrics


async def get_overview_metrics(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> OverviewMetricsSchema:
    """
    Get overview metrics for admin dashboard.

    Combines volume metrics, orders today, and revenue today.

    Args:
        db: Database session
        tenant_id: Tenant UUID

    Returns:
        Overview metrics
    """
    # Get volume metrics
    volume_metrics = await calculate_volume_metrics(db, tenant_id)

    # Get orders today (orders created today)
    # Note: For MVP, count all orders (in production, filter by created_at date)
    orders_today_result = await db.execute(
        select(func.count(Order.id))
        .where(Order.tenant_id == tenant_id)
        # In production: .where(func.date(Order.created_at) == func.current_date())
    )
    orders_today = orders_today_result.scalar() or 0

    # Get revenue today (sum of completed payments)
    # Note: Payment has order_id, so we can query directly
    revenue_result = await db.execute(
        select(func.sum(PaymentModel.amount))
        .where(PaymentModel.tenant_id == tenant_id)
        .where(PaymentModel.status == PaymentStatus.COMPLETED)
        # In production: .where(func.date(PaymentModel.created_at) == func.current_date())
    )
    revenue_today = revenue_result.scalar() or Decimal("0.00")
    # For MVP, return None if no revenue (in production, would filter by date)
    revenue_today = revenue_today if revenue_today > 0 else None

    return OverviewMetricsSchema(
        load_state=volume_metrics.load_state,
        active_orders_count=volume_metrics.active_orders_count,
        pending_items_count=volume_metrics.pending_items_count,
        estimated_wait_minutes=volume_metrics.estimated_wait_minutes,
        orders_today=orders_today,
        revenue_today=revenue_today,
    )


"""Volume service for calculating kitchen load."""
import uuid
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.metrics import VolumeLoadState, VolumeMetricsResponseSchema

# Estimated prep time per item (in minutes)
ESTIMATED_PREP_TIME_PER_ITEM = 3


async def calculate_volume_metrics(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> VolumeMetricsResponseSchema:
    """
    Calculate activity volume metrics for a tenant.

    Args:
        db: Database session
        tenant_id: Tenant UUID (explicit requirement)

    Returns:
        Volume metrics response
    """
    # Count active orders (NEW or ACCEPTED)
    active_orders_result = await db.execute(
        select(func.count(Order.id)).where(
            Order.tenant_id == tenant_id,
            Order.status.in_([OrderStatus.NEW, OrderStatus.ACCEPTED]),
        )
    )
    active_orders_count = active_orders_result.scalar() or 0

    # Count pending items (items in active orders)
    pending_items_result = await db.execute(
        select(func.sum(OrderItem.quantity))
        .join(Order)
        .where(
            Order.tenant_id == tenant_id,
            Order.status.in_([OrderStatus.NEW, OrderStatus.ACCEPTED]),
        )
    )
    pending_items_count = pending_items_result.scalar() or 0

    # Calculate load state based on active orders and pending items
    load_state = _calculate_load_state(active_orders_count, pending_items_count)

    # Estimate wait time (active_orders_count * avg_items_per_order * prep_time_per_item)
    # For simplicity, assume 2 items per order average
    avg_items_per_order = 2 if active_orders_count > 0 else 0
    estimated_wait_minutes = (
        active_orders_count * avg_items_per_order * ESTIMATED_PREP_TIME_PER_ITEM
        if active_orders_count > 0
        else None
    )

    return VolumeMetricsResponseSchema(
        load_state=load_state,
        active_orders_count=active_orders_count,
        pending_items_count=pending_items_count,
        estimated_wait_minutes=estimated_wait_minutes,
    )


def _calculate_load_state(active_orders: int, pending_items: int) -> VolumeLoadState:
    """
    Calculate load state based on active orders and pending items.

    Args:
        active_orders: Number of active orders
        pending_items: Number of pending items

    Returns:
        Volume load state
    """
    # Simple heuristic: combine order count and item count
    load_score = active_orders * 2 + pending_items

    if load_score <= 5:
        return VolumeLoadState.LOW
    elif load_score <= 15:
        return VolumeLoadState.MEDIUM
    elif load_score <= 30:
        return VolumeLoadState.HIGH
    else:
        return VolumeLoadState.VERY_HIGH


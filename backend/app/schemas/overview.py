"""Overview schemas for admin dashboard."""
import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.schemas.metrics import VolumeLoadState


class OverviewMetricsSchema(BaseModel):
    """Overview metrics combining orders and volume."""

    # Volume metrics
    load_state: VolumeLoadState
    active_orders_count: int
    pending_items_count: int
    estimated_wait_minutes: int | None

    # Business metrics
    orders_today: int
    revenue_today: Decimal | None


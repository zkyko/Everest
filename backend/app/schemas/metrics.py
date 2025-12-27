"""Metrics schemas."""
from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class VolumeLoadState(str, Enum):
    """Volume load state enum."""

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"


class VolumeMetricsResponseSchema(BaseModel):
    """Volume metrics response schema."""

    load_state: VolumeLoadState
    active_orders_count: int
    pending_items_count: int
    estimated_wait_minutes: Optional[int]


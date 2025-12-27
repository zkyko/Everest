"""Integration diagnostics schemas."""
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class IntegrationStatus(str, Enum):
    """Integration status enum."""

    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    DOWN = "DOWN"
    DISABLED = "DISABLED"


class IntegrationStatusSchema(BaseModel):
    """Individual integration status."""

    name: str
    status: IntegrationStatus
    last_checked_at: datetime
    message: Optional[str] = None


class IntegrationsStatusResponseSchema(BaseModel):
    """All integrations status response."""

    integrations: list[IntegrationStatusSchema]


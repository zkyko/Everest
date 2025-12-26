"""Settings model for tenant configuration."""
import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy import Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TenantSettings(Base):
    """Tenant configuration settings."""

    __tablename__ = "tenant_settings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        unique=True,
        nullable=False,
        index=True,
    )
    # Volume settings
    walk_in_load_level: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )  # LOW, MEDIUM, HIGH, VERY_HIGH
    delivery_platform_load_level: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )
    # Time settings (in minutes)
    default_prep_time_per_item: Mapped[Optional[int]] = mapped_column(nullable=True)
    pickup_buffer_time: Mapped[Optional[int]] = mapped_column(nullable=True)
    # Business hours (stored as JSON)
    business_hours: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    # Additional settings as JSON
    additional_settings: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)


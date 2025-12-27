"""Tenant model."""
import uuid
from typing import List, Optional

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Tenant(Base):
    """Tenant (Food Truck) model."""

    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    stripe_account_id: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )  # For Stripe Connect (future)

    # Relationships
    users: Mapped[List["User"]] = relationship("User", back_populates="tenant")


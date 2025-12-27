"""Settings schemas."""
import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TenantSettingsSchema(BaseModel):
    """Tenant settings schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tenant_id: uuid.UUID
    walk_in_load_level: Optional[str] = None
    delivery_platform_load_level: Optional[str] = None
    default_prep_time_per_item: Optional[int] = None
    pickup_buffer_time: Optional[int] = None
    business_hours: Optional[dict] = None
    additional_settings: Optional[dict] = None


class TenantSettingsUpdateSchema(BaseModel):
    """Schema for updating tenant settings."""

    walk_in_load_level: Optional[str] = None
    delivery_platform_load_level: Optional[str] = None
    default_prep_time_per_item: Optional[int] = None
    pickup_buffer_time: Optional[int] = None
    business_hours: Optional[dict] = None
    additional_settings: Optional[dict] = None


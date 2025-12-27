"""Admin settings endpoints."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.settings import (
    TenantSettingsSchema,
    TenantSettingsUpdateSchema,
)
from app.services.settings_service import (
    get_or_create_tenant_settings,
    update_tenant_settings,
)
from app.utils.auth import get_current_tenant_id

router = APIRouter()


@router.get("", response_model=TenantSettingsSchema)
async def get_settings(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get tenant settings.

    Returns current configuration for the tenant.
    """
    settings = await get_or_create_tenant_settings(db, tenant_id)
    return TenantSettingsSchema.model_validate(settings)


@router.put("", response_model=TenantSettingsSchema)
async def update_settings(
    settings_data: TenantSettingsUpdateSchema,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Update tenant settings.

    Only updates fields provided in the request.
    """
    settings = await update_tenant_settings(db, tenant_id, settings_data)
    return TenantSettingsSchema.model_validate(settings)


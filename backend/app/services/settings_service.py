"""Settings service for tenant configuration."""
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.settings import TenantSettings
from app.schemas.settings import TenantSettingsUpdateSchema


async def get_tenant_settings(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> Optional[TenantSettings]:
    """
    Get tenant settings.

    Args:
        db: Database session
        tenant_id: Tenant UUID

    Returns:
        TenantSettings if exists, None otherwise
    """
    result = await db.execute(
        select(TenantSettings).where(TenantSettings.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def get_or_create_tenant_settings(
    db: AsyncSession,
    tenant_id: uuid.UUID,
) -> TenantSettings:
    """
    Get tenant settings, creating default if not exists.

    Args:
        db: Database session
        tenant_id: Tenant UUID

    Returns:
        TenantSettings instance
    """
    settings = await get_tenant_settings(db, tenant_id)
    if not settings:
        settings = TenantSettings(
            tenant_id=tenant_id,
        )
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return settings


async def update_tenant_settings(
    db: AsyncSession,
    tenant_id: uuid.UUID,
    settings_data: TenantSettingsUpdateSchema,
) -> TenantSettings:
    """
    Update tenant settings.

    Args:
        db: Database session
        tenant_id: Tenant UUID
        settings_data: Settings update data

    Returns:
        Updated TenantSettings
    """
    settings = await get_or_create_tenant_settings(db, tenant_id)

    # Update fields that are provided
    update_data = settings_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)

    await db.commit()
    await db.refresh(settings)
    return settings


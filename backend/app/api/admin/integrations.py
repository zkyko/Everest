"""Admin integration diagnostics endpoints."""
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.integrations import IntegrationsStatusResponseSchema
from app.services.diagnostics_service import get_all_integration_statuses
from app.utils.auth import get_current_tenant_id

router = APIRouter()


@router.get("/status", response_model=IntegrationsStatusResponseSchema)
async def get_integrations_status(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get status of all system integrations.

    Returns health status for Database, Stripe API, Stripe Webhooks, and other integrations.
    """
    statuses = await get_all_integration_statuses(db, tenant_id)
    return IntegrationsStatusResponseSchema(integrations=statuses)


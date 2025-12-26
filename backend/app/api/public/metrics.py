"""Public metrics endpoints."""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.middleware.tenant import get_tenant_id
from app.schemas.metrics import VolumeMetricsResponseSchema
from app.services.volume_service import calculate_volume_metrics

router = APIRouter()


@router.get("/volume", response_model=VolumeMetricsResponseSchema)
async def get_volume_metrics(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Get activity volume metrics for the current tenant.

    Returns load state, order counts, and estimated wait time.
    """
    tenant_id = get_tenant_id(request)
    return await calculate_volume_metrics(db, tenant_id)


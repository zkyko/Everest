"""Admin overview endpoints."""
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.overview import OverviewMetricsSchema
from app.services.overview_service import get_overview_metrics
from app.utils.auth import get_current_tenant_id

router = APIRouter()


@router.get("", response_model=OverviewMetricsSchema)
async def get_overview(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get overview metrics for admin dashboard.

    Returns combined metrics: volume state, active orders, orders today, and revenue.
    """
    return await get_overview_metrics(db, tenant_id)


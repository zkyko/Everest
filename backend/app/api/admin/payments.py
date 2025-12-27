"""Admin payment status endpoints."""
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.payments import PaymentStatusResponseSchema
from app.services.payment_status_service import get_payment_status
from app.utils.auth import get_current_tenant_id

router = APIRouter()


@router.get("/status", response_model=PaymentStatusResponseSchema)
async def get_payment_status_endpoint(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get Stripe payment status for the current tenant.

    Returns connection status, mode, last payment, and webhook health.
    """
    status_data = await get_payment_status(db, tenant_id)
    return PaymentStatusResponseSchema(**status_data)


"""Public checkout endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.middleware.tenant import get_tenant_id
from app.schemas.payment import CheckoutCreateSchema, CheckoutResponseSchema
from app.services.stripe_service import create_checkout_session

router = APIRouter()


@router.post("", response_model=CheckoutResponseSchema)
async def create_checkout(
    checkout_data: CheckoutCreateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a Stripe checkout session for an order.

    Tenant is automatically resolved from request.
    """
    tenant_id = get_tenant_id(request)

    try:
        result = await create_checkout_session(db, tenant_id, checkout_data)
        return CheckoutResponseSchema(
            checkout_url=result["checkout_url"],
            session_id=result["session_id"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


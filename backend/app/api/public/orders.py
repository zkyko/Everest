"""Public order endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.middleware.tenant import get_tenant_id
from app.schemas.order import OrderCreateSchema, OrderSchema
from app.services.order_service import create_order

router = APIRouter()


@router.post("", response_model=OrderSchema, status_code=status.HTTP_201_CREATED)
async def create_order_endpoint(
    order_data: OrderCreateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new order.

    Tenant is automatically resolved from request.
    """
    tenant_id = get_tenant_id(request)

    try:
        order = await create_order(db, tenant_id, order_data)
        return OrderSchema.model_validate(order)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


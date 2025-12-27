"""Admin order endpoints."""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.order import OrderStatus
from app.schemas.order import OrderSchema, OrderStatusUpdateSchema
from app.services.order_service import get_order, get_orders, update_order_status
from app.utils.auth import get_current_tenant_id

router = APIRouter()


@router.get("", response_model=list[OrderSchema])
async def list_orders(
    status_filter: Optional[OrderStatus] = Query(None, alias="status"),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all orders for the current tenant.

    Optionally filter by status using ?status=NEW query parameter.
    """
    orders_list = await get_orders(db, tenant_id, status_filter)
    return [OrderSchema.model_validate(order) for order in orders_list]


@router.get("/{order_id}", response_model=OrderSchema)
async def get_order_endpoint(
    order_id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific order by ID.

    Only returns orders belonging to the current tenant.
    """
    order = await get_order(db, tenant_id, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return OrderSchema.model_validate(order)


@router.post("/{order_id}/status", response_model=OrderSchema)
async def update_order_status_endpoint(
    order_id: uuid.UUID,
    status_data: OrderStatusUpdateSchema,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Update order status.

    Only allows updates to orders belonging to the current tenant.
    """
    order = await update_order_status(db, tenant_id, order_id, status_data.status)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return OrderSchema.model_validate(order)


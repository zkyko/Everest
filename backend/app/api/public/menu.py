"""Public menu endpoints."""
from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.middleware.tenant import get_tenant_id
from app.models.menu import MenuCategory, MenuItem, ModifierGroup
from app.schemas.menu import MenuResponseSchema

router = APIRouter()


@router.get("", response_model=MenuResponseSchema)
async def get_menu(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Get menu for the current tenant.

    Returns all categories with items and modifiers.
    """
    tenant_id = get_tenant_id(request)

    # Fetch categories with items and modifiers
    # Use selectinload for async eager loading
    result = await db.execute(
        select(MenuCategory)
        .where(MenuCategory.tenant_id == tenant_id)
        .options(
            selectinload(MenuCategory.items).selectinload(MenuItem.modifier_groups).selectinload(
                ModifierGroup.options
            )
        )
        .order_by(MenuCategory.display_order)
    )
    categories = result.unique().scalars().all()

    return MenuResponseSchema(categories=list(categories))


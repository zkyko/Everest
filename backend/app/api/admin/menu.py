"""Admin menu management endpoints."""
import uuid
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.menu import MenuCategory, MenuItem
from app.schemas.menu import MenuCategorySchema, MenuItemSchema, MenuResponseSchema
from app.utils.auth import get_current_tenant_id

router = APIRouter()


# Request schemas
class MenuItemCreateSchema(BaseModel):
    """Schema for creating a menu item."""
    name: str
    description: Optional[str] = None
    price: Decimal
    category_id: Optional[uuid.UUID] = None
    is_available: bool = True
    display_order: int = 0


class MenuItemUpdateSchema(BaseModel):
    """Schema for updating a menu item."""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category_id: Optional[uuid.UUID] = None
    is_available: Optional[bool] = None
    display_order: Optional[int] = None


class MenuCategoryCreateSchema(BaseModel):
    """Schema for creating a menu category."""
    name: str
    display_order: int = 0


class MenuCategoryUpdateSchema(BaseModel):
    """Schema for updating a menu category."""
    name: Optional[str] = None
    display_order: Optional[int] = None


@router.post("/menu-item/{menu_item_id}/soldout", status_code=status.HTTP_200_OK)
async def mark_item_sold_out(
    menu_item_id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark a menu item as sold out (unavailable).

    Only allows updates to menu items belonging to the current tenant.
    """
    result = await db.execute(
        select(MenuItem).where(
            MenuItem.id == menu_item_id,
            MenuItem.tenant_id == tenant_id,
        )
    )
    menu_item = result.scalar_one_or_none()

    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    menu_item.is_available = False
    await db.commit()

    return {"message": "Menu item marked as sold out", "menu_item_id": str(menu_item_id)}


@router.post("/menu-item/{menu_item_id}/available", status_code=status.HTTP_200_OK)
async def mark_item_available(
    menu_item_id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark a menu item as available.

    Only allows updates to menu items belonging to the current tenant.
    """
    result = await db.execute(
        select(MenuItem).where(
            MenuItem.id == menu_item_id,
            MenuItem.tenant_id == tenant_id,
        )
    )
    menu_item = result.scalar_one_or_none()

    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    menu_item.is_available = True
    await db.commit()

    return {"message": "Menu item marked as available", "menu_item_id": str(menu_item_id)}


@router.get("", response_model=MenuResponseSchema)
async def get_menu(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Get full menu with categories and items."""
    result = await db.execute(
        select(MenuCategory)
        .where(MenuCategory.tenant_id == tenant_id)
        .options(
            selectinload(MenuCategory.items)
        )
        .order_by(MenuCategory.display_order)
    )
    categories = result.unique().scalars().all()
    return MenuResponseSchema(categories=list(categories))


@router.post("/category", response_model=MenuCategorySchema, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: MenuCategoryCreateSchema,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Create a new menu category."""
    category = MenuCategory(
        tenant_id=tenant_id,
        name=category_data.name,
        display_order=category_data.display_order,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return MenuCategorySchema.model_validate(category)


@router.put("/category/{category_id}", response_model=MenuCategorySchema)
async def update_category(
    category_id: uuid.UUID,
    category_data: MenuCategoryUpdateSchema,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Update a menu category."""
    result = await db.execute(
        select(MenuCategory).where(
            MenuCategory.id == category_id,
            MenuCategory.tenant_id == tenant_id,
        )
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    if category_data.name is not None:
        category.name = category_data.name
    if category_data.display_order is not None:
        category.display_order = category_data.display_order
    
    await db.commit()
    await db.refresh(category)
    return MenuCategorySchema.model_validate(category)


@router.delete("/category/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Delete a menu category."""
    result = await db.execute(
        select(MenuCategory).where(
            MenuCategory.id == category_id,
            MenuCategory.tenant_id == tenant_id,
        )
    )
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    await db.delete(category)
    await db.commit()
    return None


@router.post("/item", response_model=MenuItemSchema, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    item_data: MenuItemCreateSchema,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Create a new menu item."""
    # Validate category if provided
    if item_data.category_id:
        result = await db.execute(
            select(MenuCategory).where(
                MenuCategory.id == item_data.category_id,
                MenuCategory.tenant_id == tenant_id,
            )
        )
        category = result.scalar_one_or_none()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
    
    menu_item = MenuItem(
        tenant_id=tenant_id,
        name=item_data.name,
        description=item_data.description,
        price=item_data.price,
        category_id=item_data.category_id,
        is_available=item_data.is_available,
        display_order=item_data.display_order,
    )
    db.add(menu_item)
    await db.commit()
    await db.refresh(menu_item)
    return MenuItemSchema.model_validate(menu_item)


@router.put("/item/{menu_item_id}", response_model=MenuItemSchema)
async def update_menu_item(
    menu_item_id: uuid.UUID,
    item_data: MenuItemUpdateSchema,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Update a menu item."""
    result = await db.execute(
        select(MenuItem).where(
            MenuItem.id == menu_item_id,
            MenuItem.tenant_id == tenant_id,
        )
    )
    menu_item = result.scalar_one_or_none()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )
    
    # Validate category if provided
    if item_data.category_id is not None:
        result = await db.execute(
            select(MenuCategory).where(
                MenuCategory.id == item_data.category_id,
                MenuCategory.tenant_id == tenant_id,
            )
        )
        category = result.scalar_one_or_none()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        menu_item.category_id = item_data.category_id
    
    if item_data.name is not None:
        menu_item.name = item_data.name
    if item_data.description is not None:
        menu_item.description = item_data.description
    if item_data.price is not None:
        menu_item.price = item_data.price
    if item_data.is_available is not None:
        menu_item.is_available = item_data.is_available
    if item_data.display_order is not None:
        menu_item.display_order = item_data.display_order
    
    await db.commit()
    await db.refresh(menu_item)
    return MenuItemSchema.model_validate(menu_item)


@router.delete("/item/{menu_item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    menu_item_id: uuid.UUID,
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db),
):
    """Delete a menu item."""
    result = await db.execute(
        select(MenuItem).where(
            MenuItem.id == menu_item_id,
            MenuItem.tenant_id == tenant_id,
        )
    )
    menu_item = result.scalar_one_or_none()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )
    
    await db.delete(menu_item)
    await db.commit()
    return None


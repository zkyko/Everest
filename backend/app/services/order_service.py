"""Order service with explicit tenant_id requirement."""
import uuid
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.menu import MenuItem, ModifierGroup, ModifierOption
from app.models.order import Order, OrderItem, OrderItemModifier, OrderStatus
from app.schemas.order import OrderCreateSchema, OrderItemCreateSchema


async def create_order(
    db: AsyncSession,
    tenant_id: uuid.UUID,
    order_data: OrderCreateSchema,
) -> Order:
    """
    Create a new order with snapshots.

    Args:
        db: Database session
        tenant_id: Tenant UUID (explicit requirement)
        order_data: Order creation data

    Returns:
        Created order
    """
    # Calculate total amount and validate menu items
    total_amount = Decimal("0.00")
    order_items_data = []

    for item_data in order_data.items:
        # Fetch menu item (must belong to tenant)
        result = await db.execute(
            select(MenuItem).where(
                MenuItem.id == item_data.menu_item_id,
                MenuItem.tenant_id == tenant_id,
                MenuItem.is_available == True,
            )
        )
        menu_item = result.scalar_one_or_none()

        if not menu_item:
            raise ValueError(f"Menu item {item_data.menu_item_id} not found or not available")

        # Calculate item total with modifiers
        item_total = menu_item.price * item_data.quantity

        # Validate and calculate modifier prices
        for modifier_data in item_data.modifiers:
            # Find modifier group and option
            result = await db.execute(
                select(ModifierGroup).where(
                    ModifierGroup.menu_item_id == menu_item.id,
                    ModifierGroup.name == modifier_data.modifier_group_name,
                    ModifierGroup.tenant_id == tenant_id,
                )
            )
            modifier_group = result.scalar_one_or_none()

            if not modifier_group:
                raise ValueError(
                    f"Modifier group {modifier_data.modifier_group_name} not found for item {menu_item.id}"
                )

            result = await db.execute(
                select(ModifierOption).where(
                    ModifierOption.modifier_group_id == modifier_group.id,
                    ModifierOption.name == modifier_data.modifier_option_name,
                    ModifierOption.tenant_id == tenant_id,
                )
            )
            modifier_option = result.scalar_one_or_none()

            if not modifier_option:
                raise ValueError(
                    f"Modifier option {modifier_data.modifier_option_name} not found"
                )

            item_total += modifier_option.price_modifier * item_data.quantity

        total_amount += item_total
        order_items_data.append((menu_item, item_data))

    # Create order
    order = Order(
        tenant_id=tenant_id,
        status=OrderStatus.NEW,
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        total_amount=total_amount,
    )
    db.add(order)
    await db.flush()  # Get order.id

    # Create order items with snapshots
    for menu_item, item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=menu_item.id,
            item_name=menu_item.name,  # Snapshot
            item_description=menu_item.description,  # Snapshot
            item_price=menu_item.price,  # Snapshot
            quantity=item_data.quantity,
        )
        db.add(order_item)
        await db.flush()  # Get order_item.id

        # Create order item modifiers with snapshots
        for modifier_data in item_data.modifiers:
            # Fetch modifier group and option again for snapshot
            result = await db.execute(
                select(ModifierGroup, ModifierOption)
                .join(ModifierOption)
                .where(
                    ModifierGroup.menu_item_id == menu_item.id,
                    ModifierGroup.name == modifier_data.modifier_group_name,
                    ModifierOption.name == modifier_data.modifier_option_name,
                    ModifierGroup.tenant_id == tenant_id,
                )
            )
            row = result.first()
            if row:
                modifier_group, modifier_option = row
                order_item_modifier = OrderItemModifier(
                    order_item_id=order_item.id,
                    modifier_group_name=modifier_group.name,  # Snapshot
                    modifier_option_name=modifier_option.name,  # Snapshot
                    price_modifier=modifier_option.price_modifier,  # Snapshot
                )
                db.add(order_item_modifier)

    await db.commit()
    await db.refresh(order)
    return order


async def get_order(
    db: AsyncSession,
    tenant_id: uuid.UUID,
    order_id: uuid.UUID,
) -> Optional[Order]:
    """
    Get an order by ID (tenant-scoped).

    Args:
        db: Database session
        tenant_id: Tenant UUID (explicit requirement)
        order_id: Order UUID

    Returns:
        Order if found, None otherwise
    """
    result = await db.execute(
        select(Order).where(Order.id == order_id, Order.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def get_orders(
    db: AsyncSession,
    tenant_id: uuid.UUID,
    status: Optional[OrderStatus] = None,
) -> List[Order]:
    """
    Get orders for a tenant (optionally filtered by status).

    Args:
        db: Database session
        tenant_id: Tenant UUID (explicit requirement)
        status: Optional order status filter

    Returns:
        List of orders
    """
    query = select(Order).where(Order.tenant_id == tenant_id)

    if status:
        query = query.where(Order.status == status)

    query = query.order_by(Order.created_at.desc())

    result = await db.execute(query)
    return list(result.scalars().all())


async def update_order_status(
    db: AsyncSession,
    tenant_id: uuid.UUID,
    order_id: uuid.UUID,
    new_status: OrderStatus,
) -> Optional[Order]:
    """
    Update order status (tenant-scoped).

    Args:
        db: Database session
        tenant_id: Tenant UUID (explicit requirement)
        order_id: Order UUID
        new_status: New order status

    Returns:
        Updated order if found, None otherwise
    """
    order = await get_order(db, tenant_id, order_id)
    if not order:
        return None

    order.status = new_status
    await db.commit()
    await db.refresh(order)
    return order


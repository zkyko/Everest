"""Order schemas."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.order import OrderStatus


class OrderItemModifierCreateSchema(BaseModel):
    """Schema for creating an order item modifier."""

    modifier_group_name: str
    modifier_option_name: str
    price_modifier: Decimal


class OrderItemCreateSchema(BaseModel):
    """Schema for creating an order item."""

    menu_item_id: uuid.UUID
    quantity: int
    modifiers: List[OrderItemModifierCreateSchema] = []


class OrderCreateSchema(BaseModel):
    """Schema for creating an order."""

    items: List[OrderItemCreateSchema]
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None


class OrderItemModifierSchema(BaseModel):
    """Order item modifier schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    modifier_group_name: str
    modifier_option_name: str
    price_modifier: Decimal


class OrderItemSchema(BaseModel):
    """Order item schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    item_name: str
    item_description: Optional[str]
    item_price: Decimal
    quantity: int
    modifiers: List[OrderItemModifierSchema] = []


class OrderSchema(BaseModel):
    """Order schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: OrderStatus
    customer_name: Optional[str]
    customer_email: Optional[str]
    customer_phone: Optional[str]
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemSchema] = []


class OrderStatusUpdateSchema(BaseModel):
    """Schema for updating order status."""

    status: OrderStatus


"""Menu schemas."""
import uuid
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ModifierOptionSchema(BaseModel):
    """Modifier option schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    price_modifier: Decimal
    display_order: int


class ModifierGroupSchema(BaseModel):
    """Modifier group schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    is_required: bool
    min_selections: int
    max_selections: int
    options: List[ModifierOptionSchema]


class MenuItemSchema(BaseModel):
    """Menu item schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: Optional[str]
    price: Decimal
    is_available: bool
    display_order: int
    modifier_groups: List[ModifierGroupSchema] = []


class MenuCategorySchema(BaseModel):
    """Menu category schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    display_order: int
    items: List[MenuItemSchema] = []


class MenuResponseSchema(BaseModel):
    """Complete menu response schema."""

    model_config = ConfigDict(from_attributes=True)

    categories: List[MenuCategorySchema]


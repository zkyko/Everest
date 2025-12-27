"""Seed script for demo data.

NOTE: Seed structure supports multiple tenants, demo is intentionally single-tenant.
"""
import asyncio
import uuid
from decimal import Decimal

from sqlalchemy import select

from app.core.database import AsyncSessionLocal, engine
from app.core.security import get_password_hash
from app.models.menu import MenuCategory, MenuItem, ModifierGroup, ModifierOption
from app.models.tenant import Tenant
from app.models.user import User


# NOTE: Seed structure supports multiple tenants,
# demo is intentionally single-tenant (Everest Food Truck)
TENANTS = [
    {
        "name": "Everest Food Truck",
        "slug": "everest",
        "is_active": True,
    }
]


async def seed_database():
    """Seed the database with demo data."""
    async with AsyncSessionLocal() as db:
        # Create tenants
        tenant_objects = {}
        for tenant_data in TENANTS:
            result = await db.execute(
                select(Tenant).where(Tenant.slug == tenant_data["slug"])
            )
            existing_tenant = result.scalar_one_or_none()

            if existing_tenant:
                tenant_objects[tenant_data["slug"]] = existing_tenant
                print(f"Tenant '{tenant_data['name']}' already exists")
            else:
                tenant = Tenant(
                    id=uuid.uuid4(),
                    name=tenant_data["name"],
                    slug=tenant_data["slug"],
                    is_active=tenant_data["is_active"],
                )
                db.add(tenant)
                await db.flush()
                tenant_objects[tenant_data["slug"]] = tenant
                print(f"Created tenant: {tenant_data['name']}")

        # Seed Everest Food Truck data
        everest = tenant_objects["everest"]

        # Create admin user for Everest
        result = await db.execute(
            select(User).where(User.email == "admin@everest.com")
        )
        admin_user = result.scalar_one_or_none()

        if not admin_user:
            admin_user = User(
                id=uuid.uuid4(),
                tenant_id=everest.id,
                email="admin@everest.com",
                hashed_password=get_password_hash("admin123"),  # Change in production!
                role="admin",
            )
            db.add(admin_user)
            print(f"Created admin user for {everest.name}")
        else:
            print(f"Admin user for {everest.name} already exists")

        # Create menu categories
        categories = {
            "Tacos": {
                "display_order": 1,
                "items": [
                    {
                        "name": "Classic Taco",
                        "description": "Traditional taco with your choice of protein",
                        "price": Decimal("8.99"),
                        "display_order": 1,
                        "modifiers": [
                            {
                                "group_name": "Protein",
                                "is_required": True,
                                "min_selections": 1,
                                "max_selections": 1,
                                "options": [
                                    {"name": "Chicken", "price_modifier": Decimal("0.00")},
                                    {"name": "Beef", "price_modifier": Decimal("1.00")},
                                    {"name": "Pork", "price_modifier": Decimal("1.50")},
                                    {"name": "Vegetarian", "price_modifier": Decimal("0.00")},
                                ],
                            },
                            {
                                "group_name": "Spice Level",
                                "is_required": False,
                                "min_selections": 0,
                                "max_selections": 1,
                                "options": [
                                    {"name": "Mild", "price_modifier": Decimal("0.00")},
                                    {"name": "Medium", "price_modifier": Decimal("0.00")},
                                    {"name": "Hot", "price_modifier": Decimal("0.00")},
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Supreme Taco",
                        "description": "Loaded taco with all the fixings",
                        "price": Decimal("12.99"),
                        "display_order": 2,
                        "modifiers": [
                            {
                                "group_name": "Protein",
                                "is_required": True,
                                "min_selections": 1,
                                "max_selections": 1,
                                "options": [
                                    {"name": "Chicken", "price_modifier": Decimal("0.00")},
                                    {"name": "Beef", "price_modifier": Decimal("1.00")},
                                ],
                            },
                        ],
                    },
                ],
            },
            "Sides": {
                "display_order": 2,
                "items": [
                    {
                        "name": "Chips & Salsa",
                        "description": "Fresh tortilla chips with house salsa",
                        "price": Decimal("4.99"),
                        "display_order": 1,
                        "modifiers": [],
                    },
                    {
                        "name": "Guacamole",
                        "description": "Fresh homemade guacamole",
                        "price": Decimal("6.99"),
                        "display_order": 2,
                        "modifiers": [],
                    },
                ],
            },
            "Drinks": {
                "display_order": 3,
                "items": [
                    {
                        "name": "Soda",
                        "description": "Assorted soft drinks",
                        "price": Decimal("2.99"),
                        "display_order": 1,
                        "modifiers": [
                            {
                                "group_name": "Size",
                                "is_required": True,
                                "min_selections": 1,
                                "max_selections": 1,
                                "options": [
                                    {"name": "Small", "price_modifier": Decimal("0.00")},
                                    {"name": "Medium", "price_modifier": Decimal("0.50")},
                                    {"name": "Large", "price_modifier": Decimal("1.00")},
                                ],
                            },
                        ],
                    },
                ],
            },
        }

        # Create categories and items
        for category_name, category_data in categories.items():
            # Check if category exists
            result = await db.execute(
                select(MenuCategory).where(
                    MenuCategory.name == category_name,
                    MenuCategory.tenant_id == everest.id,
                )
            )
            category = result.scalar_one_or_none()

            if not category:
                category = MenuCategory(
                    id=uuid.uuid4(),
                    tenant_id=everest.id,
                    name=category_name,
                    display_order=category_data["display_order"],
                )
                db.add(category)
                await db.flush()

            # Create items
            for item_data in category_data["items"]:
                result = await db.execute(
                    select(MenuItem).where(
                        MenuItem.name == item_data["name"],
                        MenuItem.tenant_id == everest.id,
                    )
                )
                item = result.scalar_one_or_none()

                if not item:
                    item = MenuItem(
                        id=uuid.uuid4(),
                        tenant_id=everest.id,
                        category_id=category.id,
                        name=item_data["name"],
                        description=item_data["description"],
                        price=item_data["price"],
                        is_available=True,
                        display_order=item_data["display_order"],
                    )
                    db.add(item)
                    await db.flush()

                    # Create modifier groups and options
                    for modifier_group_data in item_data["modifiers"]:
                        modifier_group = ModifierGroup(
                            id=uuid.uuid4(),
                            tenant_id=everest.id,
                            menu_item_id=item.id,
                            name=modifier_group_data["group_name"],
                            is_required=modifier_group_data["is_required"],
                            min_selections=modifier_group_data["min_selections"],
                            max_selections=modifier_group_data["max_selections"],
                        )
                        db.add(modifier_group)
                        await db.flush()

                        # Create modifier options
                        for idx, option_data in enumerate(modifier_group_data["options"]):
                            modifier_option = ModifierOption(
                                id=uuid.uuid4(),
                                tenant_id=everest.id,
                                modifier_group_id=modifier_group.id,
                                name=option_data["name"],
                                price_modifier=option_data["price_modifier"],
                                display_order=idx + 1,
                            )
                            db.add(modifier_option)

        await db.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())


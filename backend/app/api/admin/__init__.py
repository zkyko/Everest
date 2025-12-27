"""Admin API routes."""
from fastapi import APIRouter

from app.api.admin import auth, integrations, menu, orders, overview, payments, settings

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Admin - Auth"])
router.include_router(overview.router, prefix="/overview", tags=["Admin - Overview"])
router.include_router(orders.router, prefix="/orders", tags=["Admin - Orders"])
router.include_router(menu.router, prefix="/menu", tags=["Admin - Menu"])
router.include_router(payments.router, prefix="/payments", tags=["Admin - Payments"])
router.include_router(
    integrations.router, prefix="/integrations", tags=["Admin - Integrations"]
)
router.include_router(settings.router, prefix="/settings", tags=["Admin - Settings"])


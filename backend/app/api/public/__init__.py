"""Public API routes."""
from fastapi import APIRouter

from app.api.public import checkout, menu, metrics, orders

router = APIRouter()

router.include_router(menu.router, prefix="/menu", tags=["Public - Menu"])
router.include_router(orders.router, prefix="/orders", tags=["Public - Orders"])
router.include_router(checkout.router, prefix="/checkout", tags=["Public - Checkout"])
router.include_router(metrics.router, prefix="/metrics", tags=["Public - Metrics"])


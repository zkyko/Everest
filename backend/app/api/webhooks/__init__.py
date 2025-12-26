"""Webhook endpoints."""
from fastapi import APIRouter

from app.api.webhooks import stripe

router = APIRouter()

router.include_router(stripe.router, prefix="/stripe", tags=["Webhooks - Stripe"])


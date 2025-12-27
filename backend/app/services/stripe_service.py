"""Stripe service for payment processing."""
import uuid
from typing import Optional

import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import CheckoutCreateSchema

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


async def create_checkout_session(
    db: AsyncSession,
    tenant_id: uuid.UUID,
    checkout_data: CheckoutCreateSchema,
) -> dict:
    """
    Create a Stripe Checkout session.

    Args:
        db: Database session
        tenant_id: Tenant UUID (explicit requirement)
        checkout_data: Checkout creation data

    Returns:
        Dictionary with checkout_url and session_id
    """
    # Verify order exists and belongs to tenant
    from app.services.order_service import get_order

    order = await get_order(db, tenant_id, checkout_data.order_id)
    if not order:
        raise ValueError(f"Order {checkout_data.order_id} not found")

    # Create Stripe checkout session
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"Order #{str(order.id)[:8]}",
                    },
                    "unit_amount": int(order.total_amount * 100),  # Convert to cents
                },
                "quantity": 1,
            }
        ],
        mode="payment",
        success_url=checkout_data.success_url,
        cancel_url=checkout_data.cancel_url,
        metadata={
            "order_id": str(order.id),
            "tenant_id": str(tenant_id),
        },
    )

    # Create or update payment record
    result = await db.execute(
        select(Payment).where(Payment.order_id == checkout_data.order_id)
    )
    payment = result.scalar_one_or_none()
    if not payment:
        payment = Payment(
            tenant_id=tenant_id,
            order_id=order.id,
            stripe_session_id=session.id,
            amount=order.total_amount,
            status=PaymentStatus.PENDING,
        )
        db.add(payment)
    else:
        payment.stripe_session_id = session.id
        payment.status = PaymentStatus.PENDING

    await db.commit()

    return {
        "checkout_url": session.url,
        "session_id": session.id,
    }


async def handle_stripe_webhook(
    db: AsyncSession,
    payload: bytes,
    signature: str,
) -> bool:
    """
    Handle Stripe webhook event.

    Args:
        db: Database session
        payload: Raw webhook payload bytes
        signature: Webhook signature from header

    Returns:
        True if handled successfully
    """
    # Verify webhook signature and parse event
    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            settings.STRIPE_WEBHOOK_SECRET,
        )
    except ValueError:
        raise ValueError("Invalid webhook payload")
    except stripe.error.SignatureVerificationError:
        raise ValueError("Invalid webhook signature")

    event_type = event.get("type")
    event_data = event.get("data", {}).get("object", {})

    if event_type == "checkout.session.completed":
        session_id = event_data.get("id")
        metadata = event_data.get("metadata", {})
        order_id = metadata.get("order_id")
        tenant_id = metadata.get("tenant_id")

        if not order_id or not tenant_id:
            return False

        # Update payment status
        result = await db.execute(
            select(Payment).where(Payment.stripe_session_id == session_id)
        )
        payment = result.scalar_one_or_none()

        if payment:
            payment.status = PaymentStatus.COMPLETED
            payment.stripe_payment_intent_id = event_data.get("payment_intent")

            # Update order status if needed
            order_result = await db.execute(
                select(Order).where(Order.id == uuid.UUID(order_id))
            )
            order = order_result.scalar_one_or_none()
            if order and order.status == OrderStatus.NEW:
                order.status = OrderStatus.ACCEPTED

            await db.commit()

    elif event_type == "payment_intent.payment_failed":
        payment_intent_id = event_data.get("id")
        # Find payment by payment_intent_id and mark as failed
        result = await db.execute(
            select(Payment).where(Payment.stripe_payment_intent_id == payment_intent_id)
        )
        payment = result.scalar_one_or_none()

        if payment:
            payment.status = PaymentStatus.FAILED
            await db.commit()

    return True


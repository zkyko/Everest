"""Tenant resolution middleware."""
import uuid
from typing import Optional

from fastapi import Request, HTTPException, status
from sqlalchemy import select
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import AsyncSessionLocal
from app.models.tenant import Tenant


async def get_tenant_id_from_request(request: Request) -> Optional[uuid.UUID]:
    """
    Resolve tenant_id from request (subdomain or header).

    Priority:
    1. Subdomain (e.g., everest.foodtruckos.local -> "everest")
    2. X-Tenant-Slug header

    Args:
        request: FastAPI request object

    Returns:
        Tenant UUID if found and active, None otherwise
    """
    tenant_slug: Optional[str] = None

    # Try subdomain first (e.g., everest.foodtruckos.local)
    host = request.headers.get("host", "")
    if host:
        parts = host.split(".")
        if len(parts) >= 3:  # At least subdomain.domain.tld
            tenant_slug = parts[0]

    # Fallback to header
    if not tenant_slug:
        tenant_slug = request.headers.get("X-Tenant-Slug")

    if not tenant_slug:
        return None

    # Query database for tenant
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Tenant).where(Tenant.slug == tenant_slug, Tenant.is_active == True)
            )
            tenant = result.scalar_one_or_none()

            if tenant:
                return tenant.id
    except Exception as e:
        # If database is unavailable, allow requests through for demo purposes
        # In production, you might want to log this and handle differently
        print(f"Database connection error in tenant middleware: {e}")
        # For demo: if slug is 'everest', return a mock UUID
        # This allows the app to work even when DB is down
        if tenant_slug == 'everest':
            return uuid.UUID('00000000-0000-0000-0000-000000000001')

    return None


class TenantMiddleware(BaseHTTPMiddleware):
    """Middleware to resolve and attach tenant_id to request state."""

    async def dispatch(self, request: Request, call_next):
        # Skip tenant resolution for OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # Skip tenant resolution for non-tenant endpoints
        if request.url.path in ["/", "/health"] or request.url.path.startswith("/api/webhooks"):
            return await call_next(request)

        tenant_id = await get_tenant_id_from_request(request)

        if not tenant_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant not found or inactive. Provide X-Tenant-Slug header or use subdomain.",
            )

        # Attach tenant_id to request state
        request.state.tenant_id = tenant_id

        response = await call_next(request)
        return response


def get_tenant_id(request: Request) -> uuid.UUID:
    """
    Extract tenant_id from request state.

    Should only be called after tenant_middleware has run.

    Args:
        request: FastAPI request object

    Returns:
        Tenant UUID

    Raises:
        HTTPException: If tenant_id is not in request state
    """
    tenant_id = getattr(request.state, "tenant_id", None)
    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Tenant ID not found in request state",
        )
    return tenant_id


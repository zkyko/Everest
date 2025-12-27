"""Authentication utilities for admin endpoints."""
import uuid
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_access_token

security = HTTPBearer()


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Extract current user from JWT token.

    Returns:
        Dictionary with user_id, tenant_id, and role

    Raises:
        HTTPException: If token is invalid or missing
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    tenant_id = payload.get("tenant_id")
    role = payload.get("role")

    if not user_id or not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return {
        "user_id": uuid.UUID(user_id),
        "tenant_id": uuid.UUID(tenant_id),
        "role": role,
    }


def get_current_tenant_id(
    current_user: dict = Depends(get_current_user),
) -> uuid.UUID:
    """
    Extract tenant_id from current user.

    Args:
        current_user: Current user dictionary from get_current_user

    Returns:
        Tenant UUID
    """
    return current_user["tenant_id"]


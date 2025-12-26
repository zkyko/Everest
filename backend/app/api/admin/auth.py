"""Admin authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import create_admin_token, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequestSchema, LoginResponseSchema

router = APIRouter()


@router.post("/login", response_model=LoginResponseSchema)
async def login(
    login_data: LoginRequestSchema,
    db: AsyncSession = Depends(get_db),
):
    """
    Admin login endpoint.

    Returns JWT token with tenant_id and role claims.
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create access token
    access_token = create_admin_token(user.id, user.tenant_id, user.role)

    return LoginResponseSchema(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        tenant_id=user.tenant_id,
        role=user.role,
    )


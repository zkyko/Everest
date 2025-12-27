"""Add tenant settings table

Revision ID: 002_add_settings
Revises: 001_initial
Create Date: 2024-01-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002_add_settings'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create tenant_settings table
    op.create_table(
        'tenant_settings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('walk_in_load_level', sa.String(length=50), nullable=True),
        sa.Column('delivery_platform_load_level', sa.String(length=50), nullable=True),
        sa.Column('default_prep_time_per_item', sa.Integer(), nullable=True),
        sa.Column('pickup_buffer_time', sa.Integer(), nullable=True),
        sa.Column('business_hours', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('additional_settings', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tenant_id')
    )
    op.create_index(op.f('ix_tenant_settings_id'), 'tenant_settings', ['id'], unique=False)
    op.create_index(op.f('ix_tenant_settings_tenant_id'), 'tenant_settings', ['tenant_id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_tenant_settings_tenant_id'), table_name='tenant_settings')
    op.drop_index(op.f('ix_tenant_settings_id'), table_name='tenant_settings')
    op.drop_table('tenant_settings')


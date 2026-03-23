"""add activity_logs table and last_login to users

Revision ID: 0002_activity_log
Revises: (put your previous revision id here, or leave blank if first)
Create Date: 2026-03-23
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '0002_activity_log'
down_revision = None   # ← replace with your latest revision id if applicable
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add last_login to users
    op.add_column(
        'users',
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
    )

    # Create activity_logs table
    op.create_table(
        'activity_logs',
        sa.Column('id',         sa.Integer,              primary_key=True, index=True),
        sa.Column('user_id',    sa.Integer,              sa.ForeignKey('users.id', ondelete='CASCADE'),
                                nullable=False, index=True),
        sa.Column('action',     sa.String(20),           nullable=False),
        sa.Column('ip_address', sa.String(45),           nullable=True),
        sa.Column('user_agent', sa.String(300),          nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  server_default=sa.text('now()'), index=True),
    )


def downgrade() -> None:
    op.drop_table('activity_logs')
    op.drop_column('users', 'last_login')

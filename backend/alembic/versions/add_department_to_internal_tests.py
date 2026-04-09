"""Add department column to internal_tests

Revision ID: add_department_internal
Revises: add_semester_internal
Create Date: 2026-04-09 10:05:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = 'add_department_internal'
down_revision = 'add_semester_internal'
branch_labels = None
depends_on = None


def upgrade():
    # Add department column
    op.add_column('internal_tests', sa.Column('department', sa.String(length=50), nullable=True))


def downgrade():
    # Remove department column
    op.drop_column('internal_tests', 'department')

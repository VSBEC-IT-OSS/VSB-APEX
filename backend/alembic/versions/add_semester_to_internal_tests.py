"""Add semester column to internal_tests

Revision ID: add_semester_internal
Revises: 875cf39ddf51
Create Date: 2026-04-09 10:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = 'add_semester_internal'
down_revision = '875cf39ddf51'
branch_labels = None
depends_on = None


def upgrade():
    # Add semester column with default value
    op.add_column('internal_tests', sa.Column('semester', sa.Integer(), nullable=False, server_default='1'))
    
    # Drop old unique constraint
    op.drop_constraint('uq_internal', 'internal_tests', type_='unique')
    
    # Create new unique constraint with semester
    op.create_unique_constraint('uq_internal', 'internal_tests', ['student_id', 'subject_code', 'test_number', 'semester'])


def downgrade():
    # Drop new unique constraint
    op.drop_constraint('uq_internal', 'internal_tests', type_='unique')
    
    # Recreate old unique constraint
    op.create_unique_constraint('uq_internal', 'internal_tests', ['student_id', 'subject_code', 'test_number'])
    
    # Remove semester column
    op.drop_column('internal_tests', 'semester')

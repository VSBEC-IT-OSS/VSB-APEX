"""Fix unique constraint to include semester

Revision ID: fix_unique_constraint
Revises: add_department_internal
Create Date: 2026-04-09 10:10:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = 'fix_unique_constraint'
down_revision = 'add_department_internal'
branch_labels = None
depends_on = None


def upgrade():
    # Drop old unique constraint
    op.drop_constraint('uq_internal', 'internal_tests', type_='unique')
    
    # Create new unique constraint with semester
    op.create_unique_constraint('uq_internal', 'internal_tests', ['student_id', 'subject_code', 'test_number', 'semester'])


def downgrade():
    # Drop new unique constraint
    op.drop_constraint('uq_internal', 'internal_tests', type_='unique')
    
    # Recreate old unique constraint
    op.create_unique_constraint('uq_internal', 'internal_tests', ['student_id', 'subject_code', 'test_number'])

# alembic/script.py.mako
"""add username and department to users

Revision ID: f662159cff2f
Revises: 875cf39ddf51
Create Date: 2026-06-30 20:37:26.271472
"""
from alembic import op
import sqlalchemy as sa


revision = 'f662159cff2f'
down_revision = '875cf39ddf51'
branch_labels = None
depends_on = None

def upgrade():
    # Add username column: String(60), unique=True, index=True, nullable=True
    op.add_column('users', sa.Column('username', sa.String(length=60), nullable=True))
    
    # Add department column: String(50), nullable=True
    op.add_column('users', sa.Column('department', sa.String(length=50), nullable=True))
    
    # Create unique constraint for username
    op.create_unique_constraint('uq_users_username', 'users', ['username'])
    
    # Create index for username
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=False)

def downgrade():
    # Drop username index
    op.drop_index(op.f('ix_users_username'), table_name='users')
    
    # Drop username unique constraint
    op.drop_constraint('uq_users_username', 'users', type_='unique')
    
    # Drop username column
    op.drop_column('users', 'username')
    
    # Drop department column
    op.drop_column('users', 'department')

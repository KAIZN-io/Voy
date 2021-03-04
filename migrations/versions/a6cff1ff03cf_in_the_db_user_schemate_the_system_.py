"""in the db_user schemate the system_passwd field got changed to is_system_passwd field with an Boolean value

Revision ID: a6cff1ff03cf
Revises: 
Create Date: 2021-02-28 10:42:06.000673

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a6cff1ff03cf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('db_user', sa.Column('is_system_passwd', sa.Integer(), nullable=True))
    op.drop_column('db_user', 'system_passwd')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('db_user', sa.Column('system_passwd', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.drop_column('db_user', 'is_system_passwd')
    # ### end Alembic commands ###

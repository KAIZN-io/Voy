"""integer operator change to boolean for the db_user model

Revision ID: 09cf4fd7fe4c
Revises: a6cff1ff03cf
Create Date: 2021-03-02 10:26:27.677175

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '09cf4fd7fe4c'
down_revision = 'a6cff1ff03cf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('db_user', 'active',
               existing_type=sa.INTEGER(),
               type_=sa.Boolean(),
               postgresql_using='active::boolean'
               )
    op.alter_column('db_user', 'is_system_passwd',
               existing_type=sa.INTEGER(),
               type_=sa.Boolean(),
               postgresql_using='is_system_passwd::boolean'
               )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('db_user', 'is_system_passwd',
               existing_type=sa.Boolean(),
               type_=sa.INTEGER(),
               postgresql_using='active::integer'
               )
    op.alter_column('db_user', 'active',
               existing_type=sa.Boolean(),
               type_=sa.INTEGER(),
               postgresql_using='is_system_passwd::integer'
               )
    # ### end Alembic commands ###
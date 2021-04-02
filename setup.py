from setuptools import setup

setup(
    name='voy',
    version='0.0.0',
    url='https://gitlab.com/piotraschke.janniklas/flask_auth_app',
    install_requires=[
        'arrow==0.17.0',
        'Flask==1.1.2',
        'Flask-Breadcrumbs==0.5.1',
        'Flask-Login==0.5.0',
        'Flask-Mail==0.9.1',
        'Flask-Menu==0.7.2',
        'Flask-Migrate==2.6.0',
        'Flask-SQLAlchemy==2.4.4',
        'pandas==1.2.3',
        'pdfkit==0.6.1',
        'psycopg2-binary==2.8.6',
        'python-dotenv==0.15.0',
        'python-json-logger==2.0.1',
        'PyYAML==5.4.1',
    ],
    python_requires='>=3',
    entry_points={
        'console_scripts': [
            'voy=voy.commands:cli'
        ],
    },
)

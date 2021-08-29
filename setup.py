from setuptools import setup, find_packages

setup(
    name='voy',
    packages=find_packages(include=['voy', 'voy.commands']),
    entry_points={
        'console_scripts': [
            'voy=voy.commands:cli'
        ],
    },
    install_requires=[
        # Hard requirements
        'arrow==0.17.*',
        'Flask==1.1.*',
        'Flask-Breadcrumbs==0.5.*',
        'Flask-Login==0.5.*',
        'Flask-Mail==0.9.*',
        'Flask-Migrate==2.6.*',
        'Flask-SQLAlchemy==2.4.*',
        'openpyxl==3.0.*',
        'pandas==1.2.*',
        'pdfkit==0.6.*',
        'psycopg2-binary==2.8.*',
        'python-dotenv==0.15.*',
        'python-json-logger==2.0.*',
        'PyYAML==5.4.*',
    ],
)

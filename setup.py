from setuptools import setup, find_packages

setup(
    name='voy',
    packages=find_packages(include=['voy', 'voy.*']),
    package_data={
        'voy': [
            'view/static/*',
            'view/static/**/*',
            'view/templates/*',
            'view/templates/**/*',
        ]
    },
    include_package_data=True,
    entry_points={
        'console_scripts': [
            'voy=voy.commands:cli'
        ],
    },
    install_requires=[
        # Hard requirements
        'arrow~=0.17.0',
        'Flask~=1.1.4',
        'Flask-Breadcrumbs~=0.5.1',
        'Flask-Login~=0.5.0',
        'Flask-Mail~=0.9.1',
        'Flask-Migrate~=2.6.0',
        'Flask-SQLAlchemy~=2.4.4',
        'openpyxl~=3.0.7',
        'pandas~=1.2.5',
        'pdfkit~=0.6.1',
        'psycopg2-binary~=2.8.6',
        'python-dotenv~=0.15.0',
        'python-json-logger~=2.0.2',
        'PyYAML~=5.4.1',
    ],
)

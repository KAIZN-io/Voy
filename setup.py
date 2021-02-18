from setuptools import setup

setup(
    name='flask-auth-app',
    entry_points={
        'console_scripts': [
            'flask-auth-app=server.commands:cli'
        ],
    },
)

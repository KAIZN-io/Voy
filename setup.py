from setuptools import setup

setup(
    name='voy',
    entry_points={
        'console_scripts': [
            'voy=server.commands:cli'
        ],
    },
)

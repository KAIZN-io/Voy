from setuptools import setup

setup(
    name='flask_auth_app',
    version='1.0',
    description='To train myself in back-end development',
    packages=['server'],
    author='Jan Piotraschke',
    zip_safe=False,
    license='MIT',
    install_requires=[
        'Flask'
    ]
)
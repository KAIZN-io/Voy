# About this project

This project was designed to fulfill the requirements of a compliant software in EU | Life Science.

An overview:

-   build with: Python Flask
-   built-in database: SQLite
-   software design pattern: Model-View-Controller (MVC)
-   runs inside a virtual environment: `nodeenv` (JS / Node.js) inside of `virtualenv` (Python)
-   runs offline: `npm` downloads the JS packages and `parcel.js` bundles them, that they are executable in the project
-   deploy it on a server with: `gunicorn`
-   message broker: Apache ActiveMQ (AMQP: AMQP 1.0 protocol)
  -   AMQP communications with the broker: qpid-proton (Python)

## Getting started on Mac
1. Create a working virtualenv with `make venv`
2. Create some required structure with `make extra_folders`
3. Temporary: Install a pdf converter with `brew cask install wkhtmltopdf`
4. Install node modules with `npm install`
5. Bundle assets with `npm run build`
6. Start the server with `flask run`
7. Open http://localhost:5000/ 

### For creating and initiating the database
1. Activate venv with `. venv/bin/activate`   

extra steps, if you use **MySQL** as your database:  
1.1. download a [MySQL Server](https://dev.mysql.com/downloads/mysql/)  
1.2. type into your terminal: `export PATH=$PATH:/usr/local/mysql/bin`  
1.3. login as root user with `mysql -u root -p`  
1.4. create the database with `CREATE DATABASE db;`  
1.5. create dummy user with `CREATE USER ‚jnp‘@‚localhost' IDENTIFIED BY ‚jnp‘`

2. Open the Flask shell with `flask shell`
3. Get the model schema with `from server.model.models import db`
4. Create the database and the tables with `db.create_all()`

### For creating new pdf and xlsx query files (temporary) 
1. Activate venv with `. venv/bin/activate`
2. Go to the AMQP server with `cd server/controller/amqp`
3. Run the server with `python3 amqp_server.py`

## Asset handling
### Install npm packages
1. Activate venv with `. venv/bin/activate`  
1.5. Only ones: To activate the **node** virtual environment along with venv in the future: `nodeenv -p`
2. Install npm package with `npm install -g {PACKAGE NAME}`
### Develop JS / CSS
Run `npm run watch` for an easy and smooth develop experience.

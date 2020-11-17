# About this project

This project was designed to fulfill the requirements of a compliant software in EU | Life Science.

An overview:

-   build with: Python Flask
-   software design pattern: Model-View-Controller (MVC)
-   runs inside a virtual environment: `nodeenv` (JS / Node.js) inside of `virtualenv` (Python). That's why you must **always activate venv** with `. venv/bin/activate`   
-   runs offline: `npm` downloads the JS packages and `parcel.js` bundles them, that they are executable in the project
-   deploy it on a server with: `gunicorn`
-   message broker: Apache ActiveMQ (AMQP: AMQP 1.0 protocol)
  -   AMQP communications with the broker: qpid-proton (Python)

# Prepare the app
1. Create a working virtualenv with `make venv` and activate it with `. venv/bin/activate`   
2. Create some required structure with `make deployment`
3. Open instance/config.py and enter some data, that look like this:
```
SECRET_KEY = 'secretPassword'
SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://<user>:<password>@<host>/db'
```
4. Install node modules with `npm install`
5. Bundle assets with `npm run build`

## Asset handling
### Install npm packages
1. Only ones: To activate the **node** virtual environment along with venv in the future: `nodeenv -p`
2. Install npm package with `npm install -g {PACKAGE NAME}`
### Develop JS / CSS
Run `npm run watch` for an easy and smooth develop experience.

# Prepare the server - Ubuntu 20.04
## Run the app in gunicorn
1. Create a working venv with `make venv`
2. Activate venv with `. venv/bin/activate`
3. You can now run the app with `gunicorn -b 0.0.0.0:5000 'server:create_app()'` or `gunicorn -b 127.0.0.1:5000 'server:create_app()'` (localhost)
4. Open e.g. http://localhost:5000/ 

### Debugging
To debug gunicorn you can add teh `--preload` flag to it. This will give you stack traces to errors that occurred.

## The database
1. 
1.1. download a [MySQL Server](https://dev.mysql.com/downloads/mysql/) or follow [this article](https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-20-04-de) if you want to use **MariaDB** on your server   
1.2. type into your terminal: `export PATH=$PATH:/usr/local/mysql/bin`  
1.3. login as root user with `mysql -u root -p`  
1.4. create the database with `CREATE DATABASE db;`  
1.5. create dummy user with `CREATE USER ‚<user>‘@‚<host>' IDENTIFIED BY ‚<password>‘;`

2. Open the Flask shell with `flask shell`
3. Get the model schema with `from server.model.user_management import db`
4. Create the database and the table with `db.create_all()`

## Usage of Python data analysis scripts over ActiveMQ
1. install ActiveMQ by following [this article](https://websiteforstudents.com/how-to-install-apache-activemq-on-ubuntu-20-04-18-04/)
2. Temporary: Install a pdf converter with `brew cask install wkhtmltopdf`
3. Go to the AMQP server with `cd server/controller/amqp`
4. Run this server with `python3 amqp_server.py`

## Configure the app
- the logging style is inside `logging.yaml`
- the app default env is "development". Set it to "production" with `export FLASK_ENV=production` before running it with `flask run`

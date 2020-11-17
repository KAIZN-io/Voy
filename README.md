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

# Getting started with local development
1. Create a working virtualenv with `make venv` and activate it with `. venv/bin/activate`
2. Only once: To activate the **node** virtual environment along with venv in the future: `nodeenv -p`

## 1. Prepare configuration
1. Create some required structure with `make deployment`
2. Open `instance/config.py` and enter some data, that look like this:
```
SECRET_KEY = 'secretPassword'
SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://<user>:<password>@<host>:<port>/<database>'
```

Replace `<user>`, `<password>`, `<host>`, `<port>` and `<database>` with the values for your local database.

### 1.1 (Optional) Docker
Don't want to locally install a MySQL or MariaDB database? Use the included Docker setup.

1. Copy `.example.env` to `.env`
2. Use the example values or adapt them to your preference
3. Update the `instance/config.py` to reflect the values in your `.env` file. The `<host>` is localhost.
4. You can now start your database with `docker-compose up`

## 2. Initialize the database
1. Open the Flask shell with `flask shell`
2. Get the model schema with `from server.model.user_management import db`
3. Create the database and the table with `db.create_all()`

## 3. Build assets
1. Install node modules with `npm install`
2. Bundle assets with `npm run build`

### 3.1 Develop assets
For a more convenient way of working with the CSS and JS assets, run `npm run watch`.

# 4. (Optional) For creating new pdf and xlsx query files (temporary) 
1. Temporary: Install a pdf converter with `brew cask install wkhtmltopdf`
2. Go to the AMQP server with `cd server/controller/amqp`
3. Run this server with `python3 amqp_server.py`

## 5. Finally: run the app
1. Start the app with `flask run`
2. Open http://localhost:5000/

# Advanced configuration
- the logging style is inside `logging.yaml`
- the app default env is "development". Set it to "production" with `export FLASK_ENV=production` before running it with `flask run`

# Deployment
In deployment the app is run with Gunicorn. To start it this way do:

1. Have your environment prepared like described in steps 1 through 3
2. You can now run the app with `gunicorn -b 0.0.0.0:5000 wsgi:app` or `gunicorn -b 127.0.0.1:5000 wsgi:app` (localhost)

## Getting started on Mac
1. Create a working venv with `make venv`
2. Create some required structure with `make extra_folders`
3. Temporary: Install a pdf converter with `brew cask install wkhtmltopdf`
4. Start the server with `flask run`
5. Open http://localhost:5000/ 

### For creating and initiating the database
1. Activate venv with `. venv/bin/activate`
2. Open the Flask shell with `flask shell`
3. Get the model schema with `from server.model.models import db`
4. Create the database and the tables with `db.create_all()`

### For creating new pdf and xlsx query files (temporary) 
1. Activate venv with `. venv/bin/activate`
2. Go to the AMQP server with `cd server/controller/amqp`
3. Run the server with `python3 amqp_server.py`

## Run in gunicorn
1. Create a working venv with `make venv`
2. Install gunicorn `pip install gunicorn`
2. You can now run the app with `gunicorn --bind 0.0.0.0:5000 wsgi:app`


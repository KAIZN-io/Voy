## Getting started on Mac
1. Create a working venv with `make venv`
2. Create some required structure with `make extra_folders`
3. Temporary: Install a pdf converter with `brew cask install wkhtmltopdf`
4. Start the server with `flask run`
5. Open http://localhost:5000/ 

### For creating new pdf and xlsx query files (temporary) 
1. Activate venv with `. venv/bin/activate`
2. Go to the AMQP server with `cd server/controller/amqp`
3. Run the server with `python3 amqp_server.py`

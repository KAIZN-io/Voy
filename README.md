# What is this software about?

A simple software tool for the quality control of source documents.    
Designed to fulfill the requirements of a compliant software in EU | Life Science respective to the GDPR.

- [An overview](#overview)
- [Quickstart](#quickstart)
- [Development](#dev)
    - [Prepare your environment](#prepare_env)
        - [Create a virtual environment](#virtual_env)
    - [Get a database](#database)
    - [Initialize the database](#init_database)
        - [Initialize the database via Docker](#init_database_via_docker)
    - [Build assets](#build_assets)
        - [Develop assets](#develop_assets)
    - [Run the app](#run_app)
- [Advanced configuration](#advanced_config)
- [Deployment](#deployment)
    - [Debugging](#debugging)
- [This project in biological words](#biology_analogon)
  

<a name="overview"></a>
# An overview

-   build with: Python Flask
-   software design pattern: Model-View-Controller (MVC)
-   runs offline: `npm` downloads the JS packages and `parcel.js` bundles them, that they are executable in the project
-   deploy it on a server with: `gunicorn`

![](project_overview.png)

<a name="quickstart"></a>
# Quickstart
1. `cp .example.env .env`
2. `docker-compose up -d p`
3. `docker-compose exec p /bin/bash`    
3.1 `flask shell`       
3.2 `from server.model import db`    
3.3 `db.create_all()`    
4.   http://localhost/     

Optional (for backups):    
4. `cp ofelia.example.ini ofelia.ini`       
5. `docker-compose up -d db-backup`

<a name="dev"></a>
# Development

<a name="prepare_env"></a>
## 1. Prepare your environment
1. Copy `.example.env` to `.env`
2. Use the example values or adapt them to your preference.

<a name="virtual_env"></a>
## 1.1. Create a virtual enviroment for development 
1. Create a working virtualenv with `make venv` and activate it with `. venv/bin/activate`

<a name="database"></a>
## 2. Get a database
Don't want to locally install a PostgreSQL database?    
Use the database from Docker with `docker-compose up -d db`

<a name="init_database"></a>
## 3. Initialize the database
1. Open the Flask shell with `flask shell`
2. Get the model schemas with `from server.model import db`
3. Create the database and the tables with `db.create_all()`

<a name="init_database_via_docker"></a>
### 3.1 Initialize the database via Docker
When using the docker setup, one can initialize the database by opening a shell inside the python docker container.
1. Start the QC Database App with `docker-compose up -d p`
2. Open a shell inside the now running container with `docker-compose exec p /bin/bash`
3. Setup the database like normal in the steps above.

<a name="build_assets"></a>
## 4. Build assets
1. Install node modules with `npm install`
2. Bundle assets with `npm run build`

<a name="develop_assets"></a>
### 4.1 Develop assets
For a more convenient way of working with the CSS and JS assets, run `npm run watch`.

<a name="run_app"></a>
## 5. Run the app 
1. Start the app with `flask run -p 5000`
2. Open http://localhost:5000/

<a name="advanced_config"></a>
# Advanced configuration
- the logging style is inside `logging.yaml`
- the app default env is "development". Set it to "production" with `export FLASK_ENV=production` before running it with `flask run`

<a name="deployment"></a>
# Deployment with Docker
This app includes a Docker setup for live deployment. Here is how to use it:

### Initial Setup
For the initial setup, just follow the instructions described in steps 1., 2. and 3.1

### Updating
The setup relies on mounting the code into the container, so code changes are relatively easy to propagate.    
However, when the python dependencies change, a rebuild of the Docker image is necessary.

- Has your `requirements.txt` changed?
  1. Run `docker-compose build` to have Docker update the image with the new dependencies.
  2. Recreate the running containers with `docker-compose up -d p`    
  
- Only changes in code?
  1. If you changed your static files run: `npm run build`
  2. Gunicorn does not reload your code, so you need to restart your `p` service: `docker-compose restart p`

<a name="debugging"></a>
## Debugging
To debug gunicorn you can add the `--preload` flag to it. This will give you stack traces to errors that occurred.    
The `--preload` flag is now set by default when using the Docker-Compose setup.

To see the logs of the `p` service run `docker-compose logs -f p`.

<a name="biology_analogon"></a>
# This project in biological words (in german)
Ein leerer *Server* ist wie eine Zelle, die nur aus einer Plasmamembran mit Signalproteinen besteht.
*ssh* entspricht diesen Proteinen auf der Plasmamembran, die Signale entgegen nehmen.  

Um die Zelle mit Grundfunktionen auszustatten, importieren wir Ribosome und elementare Netzwerkstrukturen, was in Form des Aufsetzen des Betriebssystem *Ubuntu* erfolgt.  

Das *Docker Image*, welches wir in die Zelle importieren können, entspricht der mtDNA (mitochondriale DNA), wohingegen diese mtDNA ohne das Mitochondrium exisitiert, sondern diese durch die Translation erstmalig mit allen Funktionen bildet.   

*Docker Container* sind nun wie das Mitochondrium. Sie sind eine Zelle in einer größeren Zelle (so die Endosymbiontentheorie). 

Jetzt können aber x-beliebig viele Mitochondrien in der Zelle existieren. Damit man mit ihnen kommunizieren kann, muss man deren entsprechende Membranproteine ansprechen, was *Port-binding* enstpricht 





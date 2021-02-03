# About this project

This project was designed to fulfill the requirements of a compliant software in EU | Life Science respective to the GDPR.

- [An overview](#overview)
- [Local development](#local_dev)
    - [Prepare configuration - Docker](#docker)
    - [Initialize the database](#init_database)
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
-   runs inside a virtual environment: `virtualenv` (Python). That's why you must **always activate venv** with `. venv/bin/activate`, if you run it outside of Docker 
-   the software runs offline: `npm` downloads the JS packages and `parcel.js` bundles them, that they are executable in the project
-   deploy it on a server with: `gunicorn`

![](project_overview.png)

<a name="local_dev"></a>
# Getting started with local development
1. Create a working virtualenv with `make venv` and activate it with `. venv/bin/activate`

<a name="docker"></a>
## 1. Prepare configuration - Docker
Don't want to locally install a MySQL or MariaDB database? Use the included Docker setup.

1. Copy `.example.env` to `.env`. Use the example values or adapt them to your preference.
2. You can now start your database with `docker-compose up -d db`

<a name="init_database"></a>
## 2. Initialize the database
1. Open the Flask shell with `flask shell`
2. Get the model schemas with `from server.model import db`
3. Create the database and the tables with `db.create_all()`

### 2.1 Initialize the database in Docker
When using the docker setup, one can initialize the database by opening a shell inside the python docker container. This
is useful when there is no setup on the host machine to run the python code locally.

1. Start the python service with `docker-compose up -d p`
2. Open a shell inside the now running container with `docker-compose exec p /bin/bash`
3. Setup the database like normal in the steps above.

<a name="build_assets"></a>
## 3. Build assets
1. Install node modules with `npm install`
2. Bundle assets with `npm run build`

<a name="develop_assets"></a>
### 3.1 Develop assets
For a more convenient way of working with the CSS and JS assets, run `npm run watch`.

<a name="run_app"></a>
## 4. Finally: run the app
1. Start the app with `flask run -p 5000`
2. Open http://localhost:5000/

### 4.1 Run the app in Docker
2.1. Start the app with `docker-compose up -d p`
2.2. Open http://localhost/ (Port may bi different depending on your `.env` configuration.)

<a name="advanced_config"></a>
# Advanced configuration
- the logging style is inside `logging.yaml`
- the app default env is "development". Set it to "production" with `export FLASK_ENV=production` before running it with `flask run`

<a name="deployment"></a>
# Deployment with Docker
This app includes a Docker setup for live deployment. Here is how to use it:

### Initial Setup
For the initial setup, just follow the instructions described in steps 1., 2.1., 3. and 4.1

### Updating
The setup relies on mounting the code into the container, so code changes are relatively easy to propagate. However,
when the python dependencies change, a rebuild of the Docker image is necessary.

- Has your `requirements.txt` changed?
  1. Run `docker-compose build` to have Docker update the image with the new dependencies.
  2. Recreate the running containers with `docker-compose up -d p`    
  
- Only changes in code?
  1. If you changed your static files run: `npm run build`
  2. Gunicorn does not reload your code, so you need to restart your `p` service: `docker-compose restart p`

### Scheduled database backups
The Docker setup also includes a container for creating scheduled backups of the database. Here is how to set them up:

1. Copy `ofelia.example.ini` to `ofelia.ini`. Use the example values or adapt them to your preference. See: [mcuadros/ofelia](https://github.com/mcuadros/ofelia)
2. You can now start your database backups with `docker-compose up -d db-backups`

#### Adapt the location of the backups
The location where the backups are stored can be adapted in the `.env` file with the `DB_BACKUP_DIR` variable.

<a name="debugging"></a>
## Debugging
To debug gunicorn you can add the `--preload` flag to it. This will give you stack traces to errors that occurred. The
`--preload` flag is now set by default when using the Docker-Compose setup.

To see the logs of the `p` service run `docker-compose logs -f p`.

<a name="biology_analogon"></a>
# This project in biological words (in german)
Ein leerer *Server* ist wie eine Zelle, die nur aus einer Plasmamembran mit Signalproteinen besteht.
*ssh* entspricht diesen Proteinen auf der Plasmamembran, die Signale entgegen nehmen.  

Um die Zelle mit Grundfunktionen auszustatten, importieren wir Ribosome und elementare Netzwerkstrukturen, was in Form des Aufsetzen des Betriebssystem *Ubuntu* erfolgt.  

Das *Docker Image*, welches wir in die Zelle importieren können, entspricht der mtDNA (mitochondriale DNA), wohingegen diese mtDNA ohne das Mitochondrium exisitiert, sondern diese durch die Translation erstmalig mit allen Funktionen bildet.   

*Docker Container* sind nun wie das Mitochondrium. Sie sind eine Zelle in einer größeren Zelle (so die Endosymbiontentheorie). 

Jetzt können aber x-beliebig viele Mitochondrien in der Zelle existieren. Damit man mit ihnen kommunizieren kann, muss man deren entsprechende Membranproteine ansprechen, was *Port-binding* enstpricht 





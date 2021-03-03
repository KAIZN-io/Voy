# Important for the developement process
# ============================================================
# SHELL := /bin/bash

# Import env variables
include .env
export


# Setup the virtual environment for development
.PHONY: venv
venv: 
	python3 -m venv venv; \
	source venv/bin/activate; \
	pip3 install -r requirements.txt;


########################################################################################################################
# PYTHON                                                                                                             #
########################################################################################################################

# (Re-)installs python packages
.PHONY: pip-install
pip-install:
	docker-compose exec p pip3 install -r requirements.txt


########################################################################################################################
# ASSETS                                                                                                             #
########################################################################################################################

# Installs node packages and builds the frontend assets
.PHONY: assets
assets:
	npm install
	npm run build


########################################################################################################################
# MIGRATIONS                                                                                                           #
########################################################################################################################

# Creates migration for changes in the database
.PHONY: db-revision
db-revision:
	@echo "Please run 'docker-compose exec p flask db revision' manually and specify a message with the '-m' parameter!"

# Applies pending migrations to the database
.PHONY: db-upgrade
db-upgrade:
	docker-compose exec p flask db upgrade


########################################################################################################################
# DATABASE                                                                                                             #
########################################################################################################################

# Creates a simple backup of the database; Useful for development purposes.
.PHONY: db-snapshot
db-snapshot:
	docker-compose exec db pg_dump -Fp --username=$(DB_USER) --dbname=$(DB_NAME) > ./backups/snapshot.sql

# Restores a previously created backup of the database after ending the session between the container 'p' and 'db'.
.PHONY: db-restore
db-restore:
	docker-compose stop db; \
	docker-compose up -d db; \
	docker-compose exec -T db psql --username=$(DB_USER) --dbname=postgres -c 'DROP DATABASE "$(DB_NAME)";'; \
	docker-compose exec -T db psql --username=$(DB_USER) --dbname=postgres -c 'CREATE DATABASE "$(DB_NAME)";'; \
	docker-compose exec -T db psql --username=$(DB_USER) --dbname=$(DB_NAME) < ./backups/2021-03-02_10h57m48s-UTC/$(DB_NAME).sql

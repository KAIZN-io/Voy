# Important for the development process
# ============================================================
# SHELL := /bin/bash

# Import env variables
include .env
export



########################################################################################################################
# PYTHON                                                                                                             #
########################################################################################################################

# Setup the virtual environment. Recommended for development.
.PHONY: venv
venv:
	python3 -m venv venv && \
	source venv/bin/activate && \
	pip3 install -e .

# (Re-)installs python packages
.PHONY: pip-install
pip-install:
	docker-compose exec voy pip3 install -r requirements.txt



########################################################################################################################
# ASSETS                                                                                                             #
########################################################################################################################

# Installs node packages
.PHONY: npm-install
npm-install:
	docker-compose exec voy npm install

# builds the frontend assets
.PHONY: assets
assets: npm-install
	docker-compose exec voy npm run build



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
	docker-compose exec voy flask db upgrade



########################################################################################################################
# DATABASE                                                                                                             #
########################################################################################################################

# Initializes an empty database with the basic structure needed for the application to run.
.PHONY: db-init
db-init:
	docker-compose exec voy voy database init

# Creates a simple backup of the database; Useful for development purposes.
.PHONY: db-snapshot
db-snapshot:
	docker-compose exec db pg_dump -Fp --username=$(DB_USERNAME) --dbname=$(DB_NAME) > ./backups/snapshot.sql

# Restores a previously created backup of the database.
.PHONY: db-restore
db-restore:
	docker-compose exec -T db psql --username=$(DB_USERNAME) --dbname=$(DB_NAME) < ./backups/snapshot.sql


########################################################################################################################
# PRODUCTION                                                                                                             #
########################################################################################################################

# Starts the production setup
.PHONY: start-production
start-production:
	docker-compose -f docker-compose.production.yaml up -d

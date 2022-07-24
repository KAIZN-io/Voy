# Important for the development process
# ============================================================
# SHELL := /bin/bash

# Import env variables
include .env
export


# The base command to start the docker setup.
DOCKER_COMPOSE = docker compose


########################################################################################################################
# ASSETS                                                                                                               #
########################################################################################################################

# Installs node packages
.PHONY: npm-install
npm-install:
	$(DOCKER_COMPOSE) exec voy npm install

# builds the frontend assets
.PHONY: assets
assets: npm-install
	$(DOCKER_COMPOSE) exec voy npm run build



########################################################################################################################
# DATABASE                                                                                                             #
########################################################################################################################

# Initializes an empty database with the basic structure needed for the application to run.
.PHONY: db-init
db-init:
	$(DOCKER_COMPOSE) exec voy voy database init

# Creates a simple backup of the database; Useful for development purposes.
.PHONY: db-snapshot
db-snapshot:
	$(DOCKER_COMPOSE) exec db pg_dump -Fp --username=$(DB_USERNAME) --dbname=$(DB_NAME) > ./backups/snapshot.sql

# Restores a previously created backup of the database.
.PHONY: db-restore
db-restore:
	$(DOCKER_COMPOSE) exec -T db psql --username=$(DB_USERNAME) --dbname=$(DB_NAME) < ./backups/snapshot.sql

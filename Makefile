# Important for the development process
# ============================================================
# SHELL := /bin/bash

# Import env variables
include .env
export


# The base command to start the docker setup.
DOCKER_COMPOSE = docker compose


########################################################################################################################
# DEPENDENCIES                                                                                                               #
########################################################################################################################

# Install all python packages
.PHONY: venv
venv:
	poetry install

# Install all node modules
.PHONY: node_modules
node_modules:
	yarn install

# builds the frontend assets
.PHONY: assets
assets: node_modules
	yarn build:dev


########################################################################################################################
# DOCKER                                                                                                               #
########################################################################################################################

# Builds and starts or updates all Docker services up in the background
.PHONY: daemon
daemon:
	$(DOCKER_COMPOSE) up -d voy

# Stops all Docker services
.PHONY: stop
stop:
	$(DOCKER_COMPOSE) stop

# Starts all Docker services and the Webpack dev-server for frontend development
.PHONY: start
start:
	$(DOCKER_COMPOSE) start
	yarn start

# Restarts all running Docker services
.PHONY: restart
restart:
	$(DOCKER_COMPOSE) restart


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


########################################################################################################################
# SETUP                                                                                                                #
########################################################################################################################

# Initially setup everything for development
.PHONY: init
init: venv assets
	$(MAKE) daemon

	@echo
	@echo "Waiting 10s for the databasae to be ready..."
	@echo
	@sleep 10

	@$(MAKE) db-init

	$(MAKE) start

# Removes everything
.PHONY: clean
clean:
	$(DOCKER_COMPOSE) down -v
	rm -rf node_modules
	rm -rf venv
	rm -rf voy.egg-info

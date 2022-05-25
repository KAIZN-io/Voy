# Important for the development process
# ============================================================
# SHELL := /bin/bash

# Import env variables
include .env
export



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

# Build the production image
.PHONY: bild-production
bild-production:
	docker-compose -f docker-compose.production.yml build voy

# Starts the production setup
.PHONY: init-production
init-production: start-production
	docker-compose -f docker-compose.production.yml exec voy voy database init

# Starts the production setup
.PHONY: start-production
start-production:
	docker-compose -f docker-compose.production.yml up -d

#!/bin/sh

###########################
### INITIALISE DEFAULTS ###
###########################

if [ ! $DB_HOST ]; then
	DB_HOST="localhost"
fi;

if [ ! $DB_USERNAME ]; then
	DB_USERNAME="postgres"
fi;


###########################
#### START THE BACKUPS ####
###########################

FINAL_DB_BACKUP_DIR="/backups/`date --utc +\%Y-\%m-\%d_\%Hh\%Mm\%Ss-UTC`/"

echo "Making backup directory in $FINAL_DB_BACKUP_DIR"

if ! mkdir -p $FINAL_DB_BACKUP_DIR; then
	echo "Cannot create backup directory in $FINAL_DB_BACKUP_DIR. Go and fix it!" 1>&2
	exit 1;
fi;


###########################
###### FULL BACKUPS #######
###########################

echo -e "\n\nPerforming backups"
echo -e "--------------------------------------------\n"

for EXCLUDE_DB in ${DB_BACKUP_EXCLUDE_LIST//,/ }
do
  echo "Excluding '${EXCLUDE_DB}'."
	EXCLUDE_SCHEMA_ONLY_CLAUSE="$EXCLUDE_SCHEMA_ONLY_CLAUSE and datname !~ '$EXCLUDE_DB'"
done

FULL_BACKUP_QUERY="select datname from pg_database where not datistemplate and datallowconn $EXCLUDE_SCHEMA_ONLY_CLAUSE order by datname;"

for DB_NAME in `psql -h "$DB_HOST" -U "$DB_USERNAME" -At -c "$FULL_BACKUP_QUERY" postgres`
do
  echo "Backing up '${DB_NAME}'..."

  if ! pg_dump -Fp --host="$DB_HOST" --username="$DB_USERNAME" --dbname="$DB_NAME" > $FINAL_DB_BACKUP_DIR"$DB_NAME".sql.in_progress; then
    echo "[!!ERROR!!] Failed to produce plain backup database $DB_NAME" 1>&2
    exit 1
  else
    mv $FINAL_DB_BACKUP_DIR"$DB_NAME".sql.in_progress $FINAL_DB_BACKUP_DIR"$DB_NAME".sql
  fi
done

echo -e "\nAll database backups complete!"

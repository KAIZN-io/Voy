FROM mcuadros/ofelia:v0.3.3 AS builder

# Use staged build so we can bump up the alpine version
FROM alpine:3.13


###############################################################
###### RECREATE CONDITIONS FROM mcuadros/ofelia:v0.3.3 #######
###############################################################

# With the bumped up Alpine version we can noe install postgresql-client version 13.1, matching our database
RUN apk --no-cache add ca-certificates tzdata postgresql-client=13.2-r0

# this label is required to identify container with ofelia running
LABEL ofelia.service=true
LABEL ofelia.enabled=true

# Copy over the ofelia binary from the previous stage
COPY --from=builder /usr/bin/ofelia /usr/bin/ofelia

# Set the original entrypoint and command as in mcuadros/ofelia:v0.3.3
ENTRYPOINT ["/usr/bin/ofelia"]
CMD ["daemon", "--config", "/etc/ofelia/config.ini"]


###############################################################
###### ADD OUR OWN BACKUP SCRIPT #######
###############################################################

# Hostname to adhere to pg_hba policies.
ENV DB_HOST=localhost

# Username to connect to database as.
ENV DB_USER=postgres

# List of strings to match against in database name, separated by space or comma, which we
# wish to exclude. Any database names which contain any of these
# values will be considered candidates. (e.g. "system_log" will match "dev_system_log_2010-01")
ENV DB_BACKUP_EXCLUDE_LIST=""

# install the script
COPY pg_backup.sh /usr/local/bin/pg_backup
RUN chmod +x /usr/local/bin/pg_backup

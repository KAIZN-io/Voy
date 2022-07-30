#!/bin/bash


################################################################################
# Constants                                                                    #
################################################################################

# General constants
ENV_FILE=".env"

# Color constants
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
# No Color - Resets all previous set colors.
NC='\033[0m'


################################################################################
# Functions                                                                    #
################################################################################

display_help () {
  echo
  echo -e "Usage: voy.sh [command]"
  echo
  echo -e "Available commands:"
  echo -e "    init   - Runs the setup wizzard and initializes the Docker setup for Voy."
  echo -e "    start  - Starts the Voy Docker setup."
  echo -e "    stop   - Stops the Voy Docker setup."
  echo -e "    logs   - Displays logs of all Docker containers."
  echo -e "    update - Updates Voy to the newest version."
  echo
}

warn_and_exit_if_no_argument_were_supplied () {
  if [[ $# -eq 0 ]]; then
    echo
    echo -e "${RED}Error. No argument supplied.${NC}"
    display_help
    exit 21
  fi
}

warn_and_exit_if_too_many_arguments_were_supplied () {
  if [[ $# -gt 1 ]]; then
    echo
    echo -e "${RED}Error. Too many arguments supplied.${NC}"
    display_help
    exit 22
  fi
}

warn_and_exit_if_pre_requisites_are_missing () {
  pre_requisite_missing=false

  # Checking for Docker
  if ! command -v docker &> /dev/null; then
    pre_requisite_missing=true

    echo
    echo -e "${RED}Docker is not installed!${NC}"
  fi

  # Exiting in case of a missing pre-requisite
  if [ "$pre_requisite_missing" = true ]; then
    echo
    echo -e "Please install the missing pre-requisites and try again."
    echo

    exit 1
  fi
}

does_configuration_exist () {
  if test -f "${ENV_FILE}"; then
    true
  else
    false
  fi
}

create_configuration () {

  #
  # Confirm overwriting existing configuration
  if does_configuration_exist; then
    echo
    echo -e "${RED}Error. Existing configuration found.${NC}"
    echo

    while true; do
      read -p "Do you want to overwrite it? (yes/no): " -r

      case $REPLY in
        yes | Yes | YES)
          echo
          echo -e "${YELLOW}Warning. Existing configuration will be overwritten.${NC}"
          break
          ;;
        y | Y)
          echo -e "Please type \"yes\"."
          ;;
        n | N | no | No | NO)
          echo
          echo -e "Aborting."

          exit 41
          ;;
        *)
          echo
          echo -e "Invalid option \"${REPLY}\". Aborting."

          exit 42
          ;;
      esac
    done
  fi

  #
  # Start building the new configuration
  configuration="#"$'\n'
  configuration+="# Production Settings"$'\n'

  #
  # Configure the host name
  echo
  echo -e "Please enter the hostname under which you plan on running Voy."
  echo -e "Enter the hostname wihtout the protocol and any leading or trailing slashes. Eg.: \"voy.kaizn.io\"."
  read -p "Voy hostname: " -r
  configuration+="VOY_HOST=${REPLY}"$'\n'

  #
  # Define the type of hosting
  echo
  echo -e "How would you like to host your Voy instance?"

  IFS=''

  hosting_type_option_http_label="HTTP only"
  hosting_type_option_http_value="http"
  hosting_type_option_https_letsencrypt_label="HTTPS with Letsencrypt"
  hosting_type_option_https_letsencrypt_value="https-letsencrypt"

  hosting_types=(
    $hosting_type_option_http_label
    $hosting_type_option_https_letsencrypt_label
  )

  PS3="Enter a number: "

  select choice in ${hosting_types[@]}; do
    case $choice in

      $hosting_type_option_http_label)
        # Setting the hosting type
        configuration+="VOY_HOSTING_TYPE=${hosting_type_option_http_value}"$'\n'
        # Configuring ports
        configuration+="VOY_HTTP_PORT=8080"$'\n'

        break
        ;;

      $hosting_type_option_https_letsencrypt_label)
        # Setting the hosting type
        configuration+="VOY_HOSTING_TYPE=${hosting_type_option_https_letsencrypt_value}"$'\n'
        # Configuring ports
        configuration+="VOY_HTTP_PORT=8080"$'\n'
        configuration+="VOY_HTTPS_PORT=4043"$'\n'
        # Asking for an email address for Let's Encrypt
        echo
        echo -e "Please enter an email address to use for Let's Encrypt."
        read -p "Let's Encrypt eail address: " -r
        configuration+="LETSENCRYPT_EMAIL=${REPLY}"$'\n'
        # Configuring the Let's Encrypt data path
        configuration+="LETSENCRYPT_DATA_PATH=./letsencrypt"$'\n'

        break
        ;;

      *)
        echo "Invalid option ${REPLY}. Try again."
        ;;

      esac
  done

  #
  # Setup the rest of the configuration
  configuration+=""$'\n'
  configuration+="#"$'\n'
  configuration+="# Flask Settings"$'\n'
  configuration+="FLASK_APP=voy"$'\n'
  configuration+="FLASK_ENV=production"$'\n'
  configuration+="DEBUG=0"$'\n'
  configuration+="TESTING=0"$'\n'
  configuration+=""$'\n'
  configuration+="#"$'\n'
  configuration+="# Security Settings"$'\n'
  configuration+="SECRET_KEY=$( tr -dc A-Za-z0-9 < /dev/urandom | head -c 128 ; echo '' )"$'\n'
  configuration+=""$'\n'
  configuration+="#"$'\n'
  configuration+="# Database settings"$'\n'
  configuration+="DB_HOST=db"$'\n'
  configuration+="DB_PORT=5432"$'\n'
  configuration+="DB_USERNAME=voy"$'\n'
  configuration+="DB_PASSWORD=$( tr -dc A-Za-z0-9 < /dev/urandom | head -c 24 ; echo '' )"$'\n'
  configuration+="DB_NAME=voy"$'\n'
  configuration+=""$'\n'

  #
  # Write configuration
  rm -f $ENV_FILE ||:
  touch $ENV_FILE
  echo $configuration > $ENV_FILE
}


warn_and_exit_if_pre_requisites_are_missing

warn_and_exit_if_no_argument_were_supplied $@

warn_and_exit_if_too_many_arguments_were_supplied $@

echo $0
echo $@

#
# Check whether or not to start the setup
# We are doing this here, as for this command no env file is needed.
# For all other commands we check whether a env file exists.
if [[ $1 == "init" ]]; then
  create_configuration

  echo
  echo -e "Configuration successfully created. Starting Docker..."
fi

#
# Make sure the env file exists
if ! does_configuration_exist; then
  echo
  echo -e "${RED}Error. No configuration file found.${NC}"
  echo
  echo -e "Please run 'sh voy.sh init' to create one."
  echo

  exit 31
fi

#
# Source all variables from the env file
. $PWD/$ENV_FILE

#
# Set the Docker Compose command with a dynamic file as defined by the env file
DOCKER_COMPOSE="docker compose --env-file ${ENV_FILE} -f docker-compose.prod.base.yml -f docker-compose.prod.${VOY_HOSTING_TYPE}.yml"

#
# Continue setup
if [[ $1 == "init" ]]; then

  echo
  echo ">" $DOCKER_COMPOSE "build"
  eval $DOCKER_COMPOSE "build"

  echo
  echo ">" $DOCKER_COMPOSE "up -d voy"
  eval $DOCKER_COMPOSE "up -d voy"

  echo
  echo -e "Docker is running. Waiting for the database to be ready..."

  sleep 10

  echo
  echo -e "Begin interactive database setup."

  echo
  echo ">" $DOCKER_COMPOSE "exec voy voy database init"
  eval $DOCKER_COMPOSE "exec voy voy database init"

  echo
  echo "Setup completed. Voy should now be accessible under http://${VOY_HOST}/."

  exit
fi

#
# Check what we should do
case $1 in

  'start')
    echo ">" $DOCKER_COMPOSE "start voy"
    eval $DOCKER_COMPOSE "start voy"
    ;;

  'stop')
    echo ">" $DOCKER_COMPOSE "stop"
    eval $DOCKER_COMPOSE "stop"
    ;;

  'clear')
    echo
    echo ">" $DOCKER_COMPOSE "down -v"
    eval $DOCKER_COMPOSE "down -v"

    echo
    echo "> rm -f .env"
    rm -f .env
    ;;

  'logs')
    echo ">" $DOCKER_COMPOSE "logs -f"
    eval $DOCKER_COMPOSE "logs -f"
    ;;

  'display-config')
    echo ">" $DOCKER_COMPOSE "config"
    eval $DOCKER_COMPOSE "config"
    ;;

  'update')
    echo
    echo "> git pull"
    git pull

    echo
    echo ">" $DOCKER_COMPOSE "build"
    eval $DOCKER_COMPOSE "build"

    echo
    echo ">" $DOCKER_COMPOSE "up -d voy"
    eval $DOCKER_COMPOSE "up -d voy"
    ;;

  *)
    echo
    echo -e "${RED}Error. Invalid arguments supplied.${NC}"

    display_help

    exit 23
    ;;
esac

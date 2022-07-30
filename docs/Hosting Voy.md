# Hosting Voy

In this guide we explain how to host Voy with the included Docker configuration.


## Requirements

The included Docker configuration is designed to run under Linux. Running it
on Windows might be possible, but is not supported as of yet.

This guide is designed to be as simple as possible. Still, basic knowledge of
operating Linux on the terminal is assumed.


### Required Software

- [Docker](https://docs.docker.com/get-docker/) version >= 20.0.0
- [Git](https://git-scm.com/downloads) version >= 2.0.0


## Installing Voy

Installing Voy is simple. Just follow these steps:
- Run `git clone https://github.com/KAIZN-io/Voy.git` to download the code to
  your machine.
- Run `cd Voy` to enter the directory where the code was downloaded to.
- Run `bash voy.sh init` to start the interactive setup.


## Controlling Voy

**Run these command in the directory where Voy is installed.**

### Updating Voy

To update Voy run `bash voy.sh update`.

### Stopping

To stop Voy run `bash voy.sh stop`.

### Starting

To start Voy run `bash voy.sh start`.

### Restarting

To start Voy run `bash voy.sh restart`.

### Viewing Logs

To view the logs of Voy run `bash voy.sh logs -f voy`.

### Clear all data

**Warning, this will remove all data managed by Voy. Make sure you have working backups!**

To completely stop Voy and **remove all data**, run `bash voy.sh clear`.

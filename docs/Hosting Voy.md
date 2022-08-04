# Hosting Voy

In this guide we explain how to host Voy with the included hosting setup.


## Requirements

The included hosting setup is designed to run under Linux. Running it
on Windows might be possible, but is not supported as of yet.

This guide is designed to be as simple as possible. Still, basic knowledge of
operating Linux on the terminal is assumed.


### Required Software

- a recent [GNU/Linux distribution](https://www.gnu.org/gnu/linux-and-gnu.en.html)
- [Docker](https://docs.docker.com/get-docker/) version >= 20.0.0
- [Docker Compose](https://docs.docker.com/compose/install/) version >= 2.0.0
- [Git](https://git-scm.com/downloads) version >= 2.0.0


## Installing Voy

Installing Voy is simple. Just follow these steps:
- Run `git clone https://github.com/KAIZN-io/Voy.git` to download the code to
  your machine.
- Run `cd Voy` to enter the directory where the code was downloaded to.
- Run `bash voy.sh init` to start the interactive setup.


## Controlling Voy

This hosting setup comes with a small CLI (`voy.sh`) to make it easy to work
with Voy.

After istalling Voy, manual interventions should not be necessary. The hosting
setup is designed to always run and restart in case of an error or server
restart.

### Commands

**Run these command in the directory where Voy is installed.**

#### Updating Voy

To update Voy run `bash voy.sh update`.

#### Stopping

To stop Voy run `bash voy.sh stop`.

When manually stopping Voy with this command, it will not resume running unless
started again using the command below.

#### Starting

To start Voy run `bash voy.sh start`.

Once started, Voy will automaticall restart in case of an error or when the
server is restarted.

#### Restarting

To start Voy run `bash voy.sh restart`.

#### Viewing Logs

To view the logs of Voy run `bash voy.sh logs -f voy`.

#### Clearing all data

**Warning, this will remove all data managed by Voy. Make sure you have working backups!**

To completely stop Voy and **remove all data**, run `bash voy.sh clear`.


## Further information

### How is the included hosting setup built?

The included hosting setup is built completely with Docker and
Docker Compose. While we provide a small bash script (`voy.sh`) that makes
controlling Voy easier, there is no need to use it. One could use direct
[Docker](https://www.docker.com/resources/what-container/) and
[Docker Compose](https://docs.docker.com/compose/) commands just as well.

The included hosting setup gives you everything you need to run Voy: A database
([Postgres](https://www.postgresql.org/about/)), a load balancer and reverse
proxy ([treafik](https://traefik.io/traefik/)) and an environment to run Voy
itself.

### Is the included hosting setup reliable?

Yes. The included hosting setup is meant as a production ready way of hosting
Voy in a small to medium scale.

It features:
- Small Docker images that are fast to build.
- A production ready WSGI server: [gunicorn](https://gunicorn.org/).
- A mature load balancer and reverse proxy: [treafik](https://traefik.io/traefik/)
- A fast and reliable database: [Postgres](https://www.postgresql.org/about/)

### What exactly is traefik? And what does it do?

It might be interesting to take a closer look at what traefik does in our
hosting setup. In our hosting setup, Voy is served with
[gunicorn](https://gunicorn.org/), a Python WSGI HTTP server. Gunicorn does not
serve applications in a way that normal web-browsers could access it. Nor
does it support about SSL / HTTPS. It's sole purpose is to serve Voy in a fast
and reliable manner.
Now traefik comes in. It can work with WSGI server and make them accessible to
web-browsers. It also supports secured connections via SSL / HTTPS and works
with Let's Encrypt certificates out of the box.

In summary: It's an easy way of making your applications accessible in an easy
and secure manner.

### Do I need to use the included hosting setup?

No. But it is probably the easiest way of getting started.

The included hosting setup is just one way of hosting Voy. As it is built
in Python, there is no need to run it inside of Docker. In theory it should run
on any machine that has Python installed. However, there might be caveats on
Windows systems. We do not support them at the moment.

One can refer to the included `Dockerfile` to see what steps are necessary for
hosting Voy in your own way.

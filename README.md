# Voy

A simple project management tool for the quality control of source documents in
Clinical trials.

## Installation

Voy comes with configuration for running in Docker. Currently we support plain
http hosting and https with Let's Encrypt.

Detailed instrutions can be found here: [Hosting Voy](docs/Hosting Voy.md)

## Development

### Requirements

- yarn
- poetry
- docker
- make

### Quickstart

1. Run `cp .example.env .env` to create a basic configuration
2. Run `make init` to start your docker environment

Voy is now accessible under [localhost:5000](http://localhost:5000/).

For testing Mails, Mailhog is accessible under [localhost:5001](http://localhost:5001/)

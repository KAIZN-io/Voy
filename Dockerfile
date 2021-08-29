########################################################################################################################
# Building Assets                                                                                                      #
########################################################################################################################
FROM python:3.8-slim-buster AS assets

ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/voy

# Install system packages
RUN apt-get update
RUN apt-get -y install --no-install-recommends curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get -y install --no-install-recommends build-essential nodejs
# Clean up
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*
# Configuration
RUN npm config set update-notifier false
RUN npm config set fund false

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy over files required for building the assets
COPY .parcelrc ./
COPY voy/view/assets ./voy/view/assets

# Build assets
RUN npm run build


########################################################################################################################
# Installing Packages                                                                                                  #
########################################################################################################################
FROM python:3.8-slim-buster AS packages

ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/voy

# Install and build packages
COPY requirements.txt setup.py ./
RUN pip --use-feature=in-tree-build wheel . --wheel-dir=./wheels


########################################################################################################################
# Putting it all together                                                                                              #
########################################################################################################################
FROM python:3.8-slim-buster

ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/voy

# Install system packages
RUN apt-get update && \
    apt-get -y install --no-install-recommends python-psycopg2 wkhtmltopdf && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy over preinstalled packages from the previous build step
COPY --from=packages /usr/src/voy ./

# Install prepared dependencies and Voy
RUN pip install --no-cache-dir --no-index --find-links=./wheels -r requirements.txt && \
    pip install --no-cache-dir --no-index --find-links=./wheels -e .

# Copy over the bundled assets from the previous build step
COPY --from=assets /usr/src/voy/voy/view/static/bundle ./voy/view/static/bundle

# Copy over code
COPY . .

# Set default start command
CMD [ "gunicorn", "-b 0.0.0.0:5000", "voy:create_app()" ]

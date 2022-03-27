ARG VOY_HOME=/usr/src/voy

########################################################################################################################
# Building Assets                                                                                                      #
########################################################################################################################
FROM node:16-buster-slim AS assets

ARG DEBIAN_FRONTEND=noninteractive
ARG VOY_HOME
WORKDIR $VOY_HOME

# Configuration
RUN npm config set update-notifier false
RUN npm config set fund false

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy over files required for building the assets
COPY webpack.config.js ./
COPY voy/view ./voy/view

# Build assets
RUN yarn build


########################################################################################################################
# Installing Packages                                                                                                  #
########################################################################################################################
FROM python:3.10-slim-buster AS packages

ARG DEBIAN_FRONTEND=noninteractive
ARG VOY_HOME
WORKDIR $VOY_HOME

# Install system packages
RUN apt-get update
RUN apt-get -y install --no-install-recommends build-essential libpq-dev

# Install and build packages
COPY requirements.txt setup.py ./
RUN pip --use-feature=in-tree-build wheel gunicorn --wheel-dir=./wheels
RUN pip --use-feature=in-tree-build wheel -r requirements.txt --wheel-dir=./wheels


########################################################################################################################
# Putting it all together                                                                                              #
########################################################################################################################
FROM python:3.10-slim-buster

ARG DEBIAN_FRONTEND=noninteractive
ARG VOY_HOME
WORKDIR $VOY_HOME

# Install system packages
RUN apt-get update && \
    apt-get -y install --no-install-recommends python-psycopg2 wkhtmltopdf && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy over preinstalled packages from the previous build step
COPY --from=packages $VOY_HOME ./

# Install prepared dependencies and Voy
RUN pip install --no-cache-dir --no-index --find-links=./wheels gunicorn && \
    pip install --no-cache-dir --no-index --find-links=./wheels -r requirements.txt && \
    pip install --no-cache-dir --no-index --find-links=./wheels -e .

# Copy over the bundled assets from the previous build step
COPY --from=assets $VOY_HOME/voy/view/static ./voy/view/static

# Copy over code
COPY . .

# Set default start command
CMD [ "gunicorn", "-b 0.0.0.0:5000", "voy:create_app()" ]

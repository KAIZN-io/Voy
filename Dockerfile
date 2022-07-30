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
# Putting it all together                                                                                              #
########################################################################################################################
FROM python:3.10-slim-buster AS voy

ARG DEBIAN_FRONTEND=noninteractive
ARG VOY_HOME
WORKDIR $VOY_HOME

# Install system packages
RUN apt-get update && \
    apt-get -y install --no-install-recommends build-essential libpq-dev python-psycopg2 wkhtmltopdf && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install and setup Poetry
RUN pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false

# Copy over code
COPY . .

# Install Python dependencies as well as voy itself
RUN poetry install --no-dev --no-interaction --extras production

# Copy over the bundled assets from the previous build step
COPY --from=assets $VOY_HOME/voy/view/static ./voy/view/static

# Set default start command
CMD [ "gunicorn", "-b 0.0.0.0:5000", "voy:create_app()" ]

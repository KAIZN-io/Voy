FROM python:3.8-slim-buster

WORKDIR /usr/src/project-p

# Install system packages
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install --no-install-recommends build-essential curl python-psycopg2 && \
    curl -sL https://deb.nodesource.com/setup_15.x | bash - && apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Installing Python packages...
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy code
COPY . .

# build assets
RUN npm run build

CMD [ "gunicorn", "-b 0.0.0.0:5000", "server:create_app()" ]

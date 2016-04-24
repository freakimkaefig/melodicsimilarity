FROM ubuntu:14.04
MAINTAINER freakimkaefig

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# Set environment variables
ENV appDir /var/www/app/current

# Run updates and install dependencies
RUN apt-get update

# Install needed dependencies and clean up after
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    make \
    nginx \
    sudo \
    wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 5.3.0

# Install nvm with node and npm
 RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Setup PATH correctly
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Set the working directory
RUN mkdir -p /var/www/current
WORKDIR ${appDir}

# Add package.json and install
ADD package.json ./
RUN npm install

# Install pm2 *globally*
RUN npm i -g pm2

# Add application files
ADD . /var/www/app/current

# Expose the port
EXPOSE 3000

CMD ["pm2", "start", "processes.json", "--no-daemon"]


FROM node:5.3.0
MAINTAINER freakimkaefig

# Prepare app directory
RUN mkdir -p /usr/src/app
ADD . /usr/arc/app

# Install dependencies
WORKDIR /usr/src/app
RUN npm install

# Expose the app port
EXPOSE 3000

# Start the app
RUN npm start

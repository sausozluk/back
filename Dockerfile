FROM node:6.10.3
ENV NPM_CONFIG_LOGLEVEL warn
ARG SOZLUK_ENV
COPY . /app
WORKDIR /app
RUN ["npm", "install"]
WORKDIR /app/src
RUN ["npm", "install"]
WORKDIR /app
RUN ["npm", "test"]
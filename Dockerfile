FROM node:16.15.0

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

RUN curl "https://install.meteor.com/" | sh

COPY . /app
WORKDIR /app

RUN meteor npm install

EXPOSE 3000

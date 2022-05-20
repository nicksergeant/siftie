# Dockerfile
FROM node:6.9

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

RUN curl --insecure "https://install.meteor.com/" | sh

COPY . /app
WORKDIR /app

RUN ls -la /app

EXPOSE 3000
CMD ["meteor"]

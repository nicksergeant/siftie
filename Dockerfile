# Dockerfile
FROM node:6.9

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

RUN curl --insecure "https://install.meteor.com/" | sh

WORKDIR /root/

RUN chmod -R 700 /root/.meteor/local
RUN meteor npm install

EXPOSE 3000
CMD ["npm", "start"]

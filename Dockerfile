FROM node

WORKDIR /usr/src/wake-me-up

COPY . .

RUN cd ./vue_app && npm install && npm run build-onepage-prod
RUN cd ./webserver && npm install

WORKDIR /usr/src/wake-me-up/webserver

CMD ["npm", "run", "start"]
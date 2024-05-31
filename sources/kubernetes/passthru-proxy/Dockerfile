FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm audit fix

COPY . .

CMD ["node", "sourceProxy.js"]
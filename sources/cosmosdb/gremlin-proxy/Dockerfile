FROM node@sha256:6239c8a63890ed145ae719574112bc2e37e839a56323bef8d292a579102cdfc2
#node:18-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm audit fix
COPY . .

CMD ["node", "sourceProxy.js"]
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/examples/simple

RUN npm install
RUN npm run build

CMD ["npm", "start"]
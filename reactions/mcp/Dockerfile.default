FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build

CMD ["npm", "start"]
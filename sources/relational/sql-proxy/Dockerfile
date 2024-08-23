FROM node@sha256:1eabdb1aa3f6e68558c08501572731db560d10c2194a67d3417103b0a9868693

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "sourceProxy.js"]
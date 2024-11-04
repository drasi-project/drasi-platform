FROM node@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9
# node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build

CMD ["npm", "start"]
FROM node:18-alpine

WORKDIR /book-frontend

COPY package*.json ./

RUN npm install

COPY src ./src

COPY public ./public

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]
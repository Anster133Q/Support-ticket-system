FROM node:20-alpine

WORKDIR /app

COPY ticket-app/package*.json ./
RUN npm install

COPY ticket-app .

CMD ["npm","run","dev","--","--host"]

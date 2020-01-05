FROM arm32v7/node:10-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE $ANIMES_PORT

CMD npm start
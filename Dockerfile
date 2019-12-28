FROM node:10

# Create app directory
WORKDIR /usr/src/app
RUN git clone https://github.com/animea-FIS/animea-animes

WORKDIR animea-animes

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]
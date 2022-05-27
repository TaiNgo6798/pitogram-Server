FROM node:12.22.11-alpine3.15

WORKDIR /usr/src/app/pback

COPY package*.json ./

COPY . .

RUN npm install -g @mapbox/node-pre-gyp 

RUN npm install glob rimraf

RUN npm install

EXPOSE 6798

CMD ["npm", "run", "start:prod"]

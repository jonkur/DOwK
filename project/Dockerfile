FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN npm ci && npm run tsc
CMD npm run start
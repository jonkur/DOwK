FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN npm ci && npm install -g serve
CMD npm run build && serve -s dist
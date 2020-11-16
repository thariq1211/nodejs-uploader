FROM node:12.18.3-alpine
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
CMD [ "yarn", "start" ]
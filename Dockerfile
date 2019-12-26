FROM node:10.15.3-alpine

# Install mongodb for in-memory tests
RUN apk add mongodb=4.0.5-r0
RUN mkdir -p /app/app

WORKDIR /app

COPY ./package*.json /app/
RUN npm i

COPY ./app/ /app/app

EXPOSE 3100

CMD npm start

FROM node:10.15.3-alpine

# Install mongodb for in-memory tests
RUN apk add mongodb=4.0.5-r0
RUN mkdir /app

WORKDIR /app
EXPOSE 3100

CMD ['npm', 'start']
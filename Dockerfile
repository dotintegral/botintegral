FROM node:14.15.1 

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/

RUN yarn 

COPY ./ /app/


RUN echo "FILE .env"
RUN cat .env

CMD ["yarn", "start"]
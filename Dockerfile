FROM node:14.15.1 

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/

RUN yarn 

COPY ./ /app/

CMD ["yarn", "start"]
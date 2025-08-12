FROM node:alpine

RUN mkdir -p /usr/src/chikrice-backend && chown -R node:node /usr/src/chikrice-backend

WORKDIR /usr/src/chikrice-backend

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn", "start"]

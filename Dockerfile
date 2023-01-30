FROM node:18.13.0-slim AS build

USER node:node

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run test

RUN npm run build


FROM node:18.13.0-slim

USER node:node

WORKDIR /app

COPY --chown=node:node --from=build /app/dist ./dist

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev

CMD ["node", "dist/main"]

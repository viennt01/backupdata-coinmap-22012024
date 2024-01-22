# Build stage
FROM node:16.14.2-buster as builder

ARG VERSION
ARG APP_ENV

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install 

COPY . .

RUN yarn build 

#Run stage
FROM node:16.14.2-buster-slim

ENV NODE_ENV production

WORKDIR /app

RUN adduser --system --uid 1001 nonroot; \
    addgroup --system --gid 1001 nonroot;

COPY --from=builder --chown=nonroot ["/app/package.json", "./"]
COPY --from=builder --chown=nonroot  /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot  /app/.next ./.next

COPY public public

USER nonroot

EXPOSE 3000

CMD [ "yarn", "start" ]
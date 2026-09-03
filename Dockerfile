FROM node:24-alpine
ARG TARGET_ENVIRONMENT="staging"
WORKDIR /usr/src/app
RUN sh -c '[ -z "$http_proxy" ] || ( npm config set proxy $http_proxy; npm config set https-proxy $http_proxy )'
COPY package.json ./
RUN npm install
# tsconfig.json is required at build time: it sets verbatimModuleSyntax, without
# which TypeScript elides imports that are only used as `$store` in markup, and
# the Svelte compiler then fails with "`$t` is an illegal variable name".
COPY ./vite.config.ts ./svelte.config.js ./tsconfig.json ./
COPY ./src ./src
COPY ./static ./static

ENV NODE_ENV=staging
ENV VITE_TARGET_ENVIRONMENT=staging

RUN VITE_TARGET_ENVIRONMENT="staging" npm run build

EXPOSE 5173
CMD ["npm", "run", "release"]
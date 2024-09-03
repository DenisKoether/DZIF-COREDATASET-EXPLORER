FROM node:lts as build
ARG TARGET_ENVIRONMENT="staging"
WORKDIR /usr/src/app
RUN sh -c '[ -z "$http_proxy" ] || ( npm config set proxy $http_proxy; npm config set https-proxy $http_proxy )'
COPY package.json ./
COPY ./src/ ./src/
COPY ./vite.config.ts ./tsconfig.json ./tsconfig.node.json ./svelte.config.js ./
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html
FROM node:8.4.0 AS workspace

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

FROM workspace AS builder

RUN yarn build

FROM nginx:1.13.1 AS runtime

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist/ /usr/share/nginx/html

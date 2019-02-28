FROM node:alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
RUN yarn run build

FROM nginx
EXPOSE 80
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
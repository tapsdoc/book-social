FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/app
COPY --from=build /app/src/dist/book-social/server ./
CMD node server.mjs
EXPOSE 4000

#Web server
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/book-social /usr/share/nginx/html
EXPOSE 80
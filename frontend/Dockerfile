FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . ./

RUN npm run build -c production
CMD ["node", "/app/dist/book-social/server/server.mjs"]

#Web server
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/book-social/browser /usr/share/nginx/html
EXPOSE 80
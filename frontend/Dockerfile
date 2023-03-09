# pull official base image
FROM node:alpine as build
LABEL org.opencontainers.image.source = "https://github.com/pcmccarron/gh-action-ld-demo"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH and set LD Client Key
ENV PATH /app/node_modules/.bin:$PATH
ARG VITE_LD_CLIENT_KEY
ENV VITE_LD_CLIENT_KEY ${VITE_LD_CLIENT_KEY}

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
# add app
COPY . ./

# start app
EXPOSE 5173
RUN vite build

# launch nginx server
FROM nginx:stable-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY --from=build /app/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]


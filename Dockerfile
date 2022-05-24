FROM node:16.14.2-alpine

RUN echo "ipv6" >> /etc/modules

RUN apk add --update --no-cache git imagemagick && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

RUN git clone https://github.com/mjasnikovs/info-screen.git .

RUN npm ci --only=production
RUN npx next telemetry disable

ADD https://api.github.com/repos/mjasnikovs/info-screen/git/refs/heads/main version.js

RUN git reset --hard
RUN git pull origin main
RUN npm run build

EXPOSE 80 81

CMD ["npm", "run", "start"]

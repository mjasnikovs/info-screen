FROM node:16.14.2-alpine

RUN echo "ipv6" >> /etc/modules

RUN apk add --update --no-cache git \
	libreoffice=7.2.2.2-r2 imagemagick=7.1.0.16-r0 \
	&& rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

RUN git clone https://github.com/mjasnikovs/info-screen.git .

RUN npm ci --only=production
RUN npx next telemetry disable

ADD https://api.github.com/repos/mjasnikovs/info-screen/git/refs/heads/main version.js

RUN git reset --hard
RUN git pull origin main
COPY .env.development .env.development
RUN npm run build

EXPOSE 80 81

CMD ["npm", "run", "start"]

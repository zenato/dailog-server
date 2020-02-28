FROM node:11

ENV LC_ALL C.UTF-8

COPY . /app

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

RUN cd /app && yarn && yarn build

EXPOSE 3090

WORKDIR /app

VOLUME ['/data']

CMD yarn start

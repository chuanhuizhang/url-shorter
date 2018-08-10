FROM mhart/alpine-node:latest

ENV APP_PATH /app
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH
ADD . $APP_PATH

RUN apk add -U --no-cache \
      alpine-sdk \
      bash \
      git \
      python \
      make \
      g++ 

EXPOSE 3000

CMD ["yarn", "run", "start"]
# CMD ["tail", "-f", "/dev/null"]

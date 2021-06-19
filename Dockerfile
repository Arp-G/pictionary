FROM elixir:1.11.4

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
apt update && apt install -y apt-transport-https ca-certificates netcat inotify-tools nodejs

WORKDIR /app
COPY . /app

RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix deps.get && \
    mix deps.compile

ENTRYPOINT ["sh", "./startup.sh"]

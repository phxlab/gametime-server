FROM oven/bun:latest

WORKDIR /app

RUN bun install

COPY . .

CMD ["bun", "test", "--watch"]

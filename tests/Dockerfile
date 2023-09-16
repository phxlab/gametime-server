FROM oven/bun:latest

WORKDIR /app

RUN bun install supertest mongoose

COPY . .

CMD ["bun", "test", "--watch"]

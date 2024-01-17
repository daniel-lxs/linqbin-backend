FROM oven/bun

ARG PORT
ENV PORT=${PORT}

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY drizzle drizzle
COPY tsconfig.json .

RUN bun run migrations

RUN bun run build

ENV NODE_ENV production
CMD ["bun", "dist/index.js"]

# Define the database volume
VOLUME /app/data

EXPOSE ${PORT}

FROM oven/bun as builder

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY src ./src
COPY drizzle ./drizzle
COPY tsconfig.json .

RUN bun run build

FROM vishnubob/wait-for-it

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lockb .
COPY --from=builder /usr/local/bin/wait-for-it /usr/local/bin/wait-for-it

RUN chmod +x /usr/local/bin/wait-for-it

ENV NODE_ENV production
CMD ["wait-for-it", "postgres:5432", "--", "bun", "dist/index.js"]

EXPOSE $PORT

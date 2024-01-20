FROM oven/bun

ARG PORT
ARG MONGODB_URI
ARG MONGODB_USER
ARG MONGODB_PASSWORD

ENV PORT=${PORT}
ENV MONGODB_URI=${MONGODB_URI}
ENV MONGODB_USER=${MONGODB_USER}
ENV MONGODB_PASSWORD=${MONGODB_PASSWORD}

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .

RUN bun run build

ENV NODE_ENV production
CMD ["bun", "dist/index.js"]

# Define the database volume
VOLUME /app/data

EXPOSE ${PORT}

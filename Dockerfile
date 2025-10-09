# ---- Build Meteor bundle
FROM node:20-bullseye AS builder

# Build deps Meteor needs
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git python3 build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# Install the real Meteor CLI
RUN curl https://install.meteor.com/ | sh

WORKDIR /src

# (better caching) copy only files needed for npm install first
COPY package*.json ./
COPY .meteor/ .meteor/
RUN meteor npm ci

# now copy the rest of the source
COPY . .

# build a server-only bundle (needs --allow-superuser in Docker)
RUN meteor build --directory /build --server-only --allow-superuser

# install server npm deps for the bundle
WORKDIR /build/bundle/programs/server
RUN npm ci --omit=dev

# ---- Runtime
FROM node:20-bullseye
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=builder /build/bundle /app
EXPOSE 3000
CMD ["node", "main.js"]

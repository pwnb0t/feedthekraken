# ---- Build Meteor bundle
FROM node:20-bullseye AS builder
RUN npm install -g meteor
WORKDIR /src
COPY . .
RUN meteor npm ci
# server-only keeps client build light in the container
RUN meteor build --directory /build --server-only --allow-superuser
WORKDIR /build/bundle/programs/server
RUN npm ci --omit=dev

# ---- Runtime
FROM node:20-bullseye
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app
COPY --from=builder /build/bundle /app
EXPOSE 3000
CMD ["node", "main.js"]


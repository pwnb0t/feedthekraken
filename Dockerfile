# This is the simplified/minimal docker deploy that expects the app to be built on the dev machine
FROM node:20-bullseye
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY bundle /app
WORKDIR /app/programs/server
RUN npm ci --omit=dev || true
WORKDIR /app
EXPOSE 3000
CMD ["node", "main.js"]

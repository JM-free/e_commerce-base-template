FROM node:18.8-alpine as base

# ---------- Builder ----------
FROM base as builder
WORKDIR /home/node/app

# Install dependencies first for better layer caching
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Copy the rest of the source
COPY . .


# Provide a dummy secret only for build so Payload can initialize during NEXT build
# This is overridden at runtime by Render environment variables
ENV PAYLOAD_SECRET=buildtime-placeholder
RUN yarn build

# ---------- Runtime ----------
FROM base as runtime
ENV NODE_ENV=production
# Fix: correct path for your payload config in dist
ENV PAYLOAD_CONFIG_PATH=dist/payload/payload.config.js
WORKDIR /home/node/app

# Only production deps in runtime image
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built assets from builder
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000
CMD ["node", "dist/server.js"]

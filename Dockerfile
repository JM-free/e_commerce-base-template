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

# Only build steps that don’t require a live DB
# (skip the template’s `yarn build` which calls `build:next`)
RUN yarn build:payload && yarn build:server && yarn copyfiles

# ---------- Runtime ----------
FROM base as runtime
ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload/payload.config.js
WORKDIR /home/node/app

# Only production deps in runtime image
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built assets from builder
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

# Include Next.js source and configs for runtime build
COPY --from=builder /home/node/app/next.config.js ./
COPY --from=builder /home/node/app/src ./src
COPY --from=builder /home/node/app/public ./public
# Files imported by next.config.js
COPY --from=builder /home/node/app/csp.js ./
COPY --from=builder /home/node/app/redirects.js ./
# TypeScript config and declarations (if present)
COPY --from=builder /home/node/app/tsconfig.json ./
COPY --from=builder /home/node/app/tsconfig.server.json ./
COPY --from=builder /home/node/app/next-env.d.ts ./

EXPOSE 3000

# First: build Next at runtime using real env vars (DATABASE_URI, etc.)
# Then: start the server normally
CMD ["sh", "-c", "NEXT_BUILD=true node dist/server.js && node dist/server.js"]

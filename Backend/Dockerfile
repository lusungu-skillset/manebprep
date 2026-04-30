# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /build

COPY Backend/package*.json ./Backend/
RUN cd Backend && npm ci

COPY shared/ ./shared/
COPY Backend/ ./Backend/

WORKDIR /build/Backend
RUN npm run build

# -------------------------------
# Stage 2: Runtime
# -------------------------------
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY Backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /build/Backend/dist ./dist

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]
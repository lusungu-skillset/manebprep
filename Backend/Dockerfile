# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /build/Backend

# Copy package files
COPY Backend/package.json Backend/package-lock.json ./

# Install all deps (including dev for build)
RUN npm ci

# Copy shared code (for path aliases like @shared/*)
COPY shared/ /build/shared/

# Copy backend source
COPY Backend/ .

# Build the app
RUN npm run build

# Debug: show build output
RUN echo "==== BUILD OUTPUT ====" && ls -R dist


# -------------------------------
# Stage 2: Runtime
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package files
COPY Backend/package.json Backend/package-lock.json ./

# Install production deps only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /build/Backend/dist ./dist

# (Optional but helpful) verify files exist
RUN echo "==== RUNTIME DIST CONTENT ====" && ls -R dist

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => { if (r.statusCode !== 200) process.exit(1) })"

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Set NODE_OPTIONS to prefer IPv4 - prevents ENETUNREACH errors with cloud databases
# Must be set here AND in docker-compose because container-level settings take precedence
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# -------------------------------
# 🔥 IMPORTANT: Smart start
# Handles BOTH possible outputs:
# dist/main.js OR dist/src/main.js
# Runs with explicit DNS result order for IPv4-first resolution
# -------------------------------
CMD ["sh", "-c", "NODE_OPTIONS='--dns-result-order=ipv4first' node $([ -f dist/main.js ] && echo dist/main.js || echo dist/src/main.js)"]
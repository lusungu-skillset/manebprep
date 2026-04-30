# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy entire project (including shared/)
COPY . .

# Build the app
RUN npm run build


# -------------------------------
# Stage 2: Runtime
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Environment settings
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Expose port (Render will override)
EXPOSE 3000

# Start container safely
ENTRYPOINT ["dumb-init", "--"]

# Start app
CMD ["node", "dist/main.js"]
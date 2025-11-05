# NeuroPulse Dockerfile
FROM node:20-alpine AS base

# Install dependencies needed for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS dev
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production

# Copy built application
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S neuropulse && \
    adduser -S neuropulse -u 1001

USER neuropulse

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node dist/index.js --health || exit 1

EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]

# Build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/chikrice-backend

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN yarn build || npx tsc

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /usr/src/chikrice-backend

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/chikrice-backend/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /usr/src/chikrice-backend/src ./src

# Copy necessary config files
COPY --chown=nodejs:nodejs ecosystem.config.json ./

# Switch to non-root user
USER nodejs

EXPOSE 3000

CMD ["yarn", "start"]

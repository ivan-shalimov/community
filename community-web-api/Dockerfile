# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies for nesting build)
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Final Production Image
FROM node:22-alpine AS runner

WORKDIR /app

# Set to production to skip devDependencies and optimize performance
ENV NODE_ENV=production

# Copy only the compiled code and necessary production files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Best Practice: Run as a non-root user for security
USER node

EXPOSE 3000

# Use 'node' directly instead of 'npm run start:prod' to save memory/resources
CMD ["node", "dist/main"]
# Stage 1: Build Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Build Next.js application
# For Docker, we'll use static export but without basePath
# Unset GITHUB_PAGES to prevent basePath from being set
RUN NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-/api} GITHUB_PAGES= npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


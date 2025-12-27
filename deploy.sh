#!/bin/bash
# Everest VPS Deployment Script
# This script pulls the latest code from GitHub and deploys using Docker

set -e

echo "🚀 Everest Deployment Script"
echo "============================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}📦 Pulling latest code from GitHub...${NC}"
git pull origin main || {
    echo -e "${YELLOW}⚠️  Not a git repository or no remote configured. Continuing with local files...${NC}"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found.${NC}"
    echo -e "${YELLOW}📝 Creating .env from template...${NC}"
    
    # Create .env file with defaults
    cat > .env << EOF
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
POSTGRES_DB=everest

# Backend Configuration
SECRET_KEY=$(openssl rand -hex 32)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGINS=*
ENVIRONMENT=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=/api
EOF
    
    echo -e "${GREEN}✅ Created .env file with generated passwords.${NC}"
    echo -e "${YELLOW}⚠️  Please update STRIPE keys and other settings in .env file!${NC}"
    echo ""
    read -p "Press Enter to continue after updating .env file (or Ctrl+C to exit)..."
fi

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating backend/.env...${NC}"
    # Read values from root .env
    source .env
    
    cat > backend/.env << EOF
# Database Configuration
DATABASE_URL=postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}

# JWT Authentication
SECRET_KEY=${SECRET_KEY}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe Payment Configuration
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}

# CORS Configuration
CORS_ORIGINS=${CORS_ORIGINS}

# Environment
ENVIRONMENT=${ENVIRONMENT}
EOF
    
    echo -e "${GREEN}✅ Created backend/.env file.${NC}"
fi

# Check if frontend/.env exists
if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}📝 Creating frontend/.env...${NC}"
    source .env
    
    cat > frontend/.env << EOF
# API Configuration
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-/api}
EOF
    
    echo -e "${GREEN}✅ Created frontend/.env file.${NC}"
fi

echo ""
echo -e "${YELLOW}🐳 Building and starting Docker containers...${NC}"
echo ""

# Use docker compose (newer) or docker-compose (older)
if docker compose version &> /dev/null; then
    docker compose down
    docker compose up -d --build
else
    docker-compose down
    docker-compose up -d --build
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${GREEN}📊 Container Status:${NC}"
if docker compose version &> /dev/null; then
    docker compose ps
else
    docker-compose ps
fi

echo ""
echo -e "${GREEN}🌐 Your application should be available at:${NC}"
echo -e "   Frontend: http://$(hostname -I | awk '{print $1}')"
echo -e "   Backend API: http://$(hostname -I | awk '{print $1}')/api"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "   View logs: docker compose logs -f"
echo -e "   Stop: docker compose down"
echo -e "   Restart: docker compose restart"
echo ""


# Docker Deployment Guide for Everest VPS

This guide will help you deploy the Everest food truck ordering system to a VPS using Docker and docker-compose.

## Prerequisites

- VPS with Docker and Docker Compose installed
- Domain name (optional, but recommended)
- Basic knowledge of Linux command line

## Quick Start

### Option 1: Using Deployment Script (Recommended)

1. **Clone the repository on your VPS:**
   ```bash
   git clone https://github.com/zkyko/Everest.git
   cd Everest
   ```

2. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

The script will automatically:
- Pull latest code from GitHub
- Create `.env` files with secure passwords
- Build and deploy all containers

### Option 2: Manual Setup

1. **Clone the repository on your VPS:**
   ```bash
   git clone https://github.com/zkyko/Everest.git
   cd Everest
   ```

2. **Create environment files:**
   
   Create `backend/.env`:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/everest
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password-here
   POSTGRES_DB=everest

   # JWT Authentication
   SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30

   # Stripe Payment Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # CORS Configuration
   CORS_ORIGINS=*
   # For production, specify allowed origins:
   # CORS_ORIGINS=https://yourdomain.com

   # Environment
   ENVIRONMENT=production
   ```

   Create `frontend/.env`:
   ```env
   # API Configuration
   # For Docker deployment, use relative path /api (nginx will proxy to backend)
   NEXT_PUBLIC_API_URL=/api
   ```

3. **Create root `.env` file for docker-compose:**
   ```env
   # PostgreSQL Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password-here
   POSTGRES_DB=everest

   # Backend Configuration
   SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   CORS_ORIGINS=*
   ENVIRONMENT=production

   # Frontend Configuration
   NEXT_PUBLIC_API_URL=/api
   ```

4. **Build and start the containers:**
   ```bash
   docker-compose up -d --build
   ```

5. **Check the logs to ensure everything is running:**
   ```bash
   docker-compose logs -f
   ```

6. **Access your application:**
   - Frontend: `http://your-vps-ip`
   - Backend API: `http://your-vps-ip/api`
   - Health check: `http://your-vps-ip/api/health`

## Architecture

The Docker setup consists of three services:

1. **PostgreSQL Database** (`postgres`)
   - Stores all application data
   - Data persisted in Docker volume `postgres_data`
   - Port: 5432 (internal only)

2. **Backend API** (`backend`)
   - FastAPI application
   - Runs database migrations on startup
   - Port: 8000 (internal), exposed for debugging

3. **Frontend** (`frontend`)
   - Next.js static site served by nginx
   - Proxies `/api` requests to backend
   - Port: 80 (exposed to host)

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Access container shell
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

### Run database migrations manually
```bash
docker-compose exec backend alembic upgrade head
```

### Seed database (if needed)
```bash
docker-compose exec backend python -m app.scripts.seed
```

### View running containers
```bash
docker-compose ps
```

## Production Considerations

### 1. Security

- **Change default passwords**: Update `POSTGRES_PASSWORD` and `SECRET_KEY` in `.env`
- **Use strong secrets**: Generate secure random strings for `SECRET_KEY` (minimum 32 characters)
- **Configure CORS**: Set `CORS_ORIGINS` to your actual domain(s) instead of `*`
- **Firewall**: Only expose port 80 (and 443 for HTTPS) on your VPS

### 2. SSL/HTTPS

For production, you should set up SSL certificates. Options:

**Option A: Nginx Reverse Proxy (Recommended)**
- Install nginx on the host
- Use Let's Encrypt with Certbot
- Configure nginx to proxy to `localhost:80`
- Update `CORS_ORIGINS` to your HTTPS domain

**Option B: Traefik**
- Add Traefik service to docker-compose
- Automatic SSL with Let's Encrypt
- More complex but fully containerized

### 3. Database Backups

PostgreSQL data is stored in a Docker volume. To backup:

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres everest > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres everest < backup.sql
```

### 4. Environment Variables

Never commit `.env` files to git. They contain sensitive information.

### 5. Resource Limits

For production, consider adding resource limits to docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
    # ... rest of config
```

## Troubleshooting

### Database connection errors

1. Check if PostgreSQL is healthy:
   ```bash
   docker-compose ps postgres
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify database URL in backend logs:
   ```bash
   docker-compose logs backend | grep DATABASE_URL
   ```

### Frontend not loading

1. Check nginx logs:
   ```bash
   docker-compose logs frontend
   ```

2. Verify frontend build:
   ```bash
   docker-compose exec frontend ls -la /usr/share/nginx/html
   ```

3. Check if backend is accessible:
   ```bash
   curl http://localhost/api/health
   ```

### Backend not starting

1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Verify migrations ran:
   ```bash
   docker-compose logs backend | grep "Running database migrations"
   ```

3. Check database connectivity:
   ```bash
   docker-compose exec backend pg_isready -h postgres
   ```

### Port already in use

If port 80 is already in use:

1. Change the port mapping in `docker-compose.yml`:
   ```yaml
   frontend:
     ports:
       - "8080:80"  # Change 80 to 8080
   ```

2. Rebuild and restart:
   ```bash
   docker-compose up -d --build
   ```

## Updating the Application

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart:**
   ```bash
   docker-compose up -d --build
   ```

3. **Run any new migrations:**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## Monitoring

### Health Checks

- Frontend: `http://your-vps-ip/health`
- Backend: `http://your-vps-ip/api/health`

### Container Status

```bash
docker-compose ps
```

### Resource Usage

```bash
docker stats
```

## Support

For issues or questions:
- Check the logs: `docker-compose logs -f`
- Review this documentation
- Check GitHub issues: https://github.com/zkyko/Everest/issues


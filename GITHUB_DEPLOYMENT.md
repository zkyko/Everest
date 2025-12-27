# GitHub-Based VPS Deployment Guide

This guide explains how to deploy Everest to your VPS directly from GitHub using Docker.

## Prerequisites

- VPS with Ubuntu/Debian (or similar Linux distribution)
- Docker and Docker Compose installed
- Git installed
- SSH access to your VPS

## Step 1: Install Docker on VPS

If Docker is not already installed:

```bash
# Update package index
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes to take effect
```

## Step 2: Clone Repository on VPS

```bash
# Navigate to your preferred directory (e.g., /opt or /home/username)
cd /opt  # or wherever you want the project

# Clone the repository
git clone https://github.com/zkyko/Everest.git
cd Everest
```

## Step 3: Set Up Environment Variables

### Option A: Use the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will:
- Pull latest code from GitHub
- Create `.env` files with secure random passwords
- Build and start all containers

### Option B: Manual Setup

1. **Create root `.env` file:**

```bash
nano .env
```

Add the following (update with your values):

```env
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=everest

# Backend Configuration
SECRET_KEY=your-secret-key-min-32-chars
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGINS=*
ENVIRONMENT=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=/api
```

2. **Create `backend/.env` file:**

```bash
nano backend/.env
```

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:your-secure-password-here@postgres:5432/everest
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=everest

# JWT Authentication
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS Configuration
CORS_ORIGINS=*

# Environment
ENVIRONMENT=production
```

3. **Create `frontend/.env` file:**

```bash
nano frontend/.env
```

```env
# API Configuration
NEXT_PUBLIC_API_URL=/api
```

## Step 4: Deploy

### Using the Deployment Script

```bash
./deploy.sh
```

### Manual Deployment

```bash
# Build and start all containers
docker compose up -d --build

# Or if using older Docker Compose:
docker-compose up -d --build
```

## Step 5: Verify Deployment

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f

# Check if services are responding
curl http://localhost/api/health
curl http://localhost/health
```

## Step 6: Access Your Application

- **Frontend**: `http://your-vps-ip`
- **Backend API**: `http://your-vps-ip/api`
- **Health Check**: `http://your-vps-ip/api/health`

## Updating the Application

To update to the latest code:

```bash
# Navigate to project directory
cd /opt/Everest  # or wherever you cloned it

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Or use the deployment script
./deploy.sh
```

## Setting Up Auto-Deploy (Optional)

You can set up a cron job to automatically pull and deploy:

```bash
# Edit crontab
crontab -e

# Add this line to check for updates every hour and deploy if changes found
0 * * * * cd /opt/Everest && git fetch && [ $(git rev-parse HEAD) != $(git rev-parse origin/main) ] && /opt/Everest/deploy.sh >> /var/log/everest-deploy.log 2>&1
```

Or use a webhook-based approach with a simple webhook receiver.

## Troubleshooting

### Port 80 Already in Use

If port 80 is already in use (e.g., by Apache/Nginx):

1. **Option A**: Stop the existing service
   ```bash
   sudo systemctl stop apache2  # or nginx
   sudo systemctl disable apache2
   ```

2. **Option B**: Change the port in `docker-compose.yml`
   ```yaml
   frontend:
     ports:
       - "8080:80"  # Change 80 to 8080
   ```

### Database Connection Errors

Check if PostgreSQL container is running:
```bash
docker compose ps postgres
docker compose logs postgres
```

### Frontend Not Loading

Check nginx logs:
```bash
docker compose logs frontend
```

Verify the build completed:
```bash
docker compose exec frontend ls -la /usr/share/nginx/html
```

### Backend Not Starting

Check backend logs:
```bash
docker compose logs backend
```

Verify migrations ran:
```bash
docker compose logs backend | grep "Running database migrations"
```

## Security Recommendations

1. **Change Default Passwords**: Always change the generated passwords in `.env`
2. **Use Strong Secrets**: Generate secure random strings for `SECRET_KEY`
3. **Configure CORS**: Set `CORS_ORIGINS` to your actual domain(s)
4. **Set Up Firewall**: Only expose necessary ports (80, 443)
5. **Use SSL/HTTPS**: Set up Let's Encrypt for production
6. **Regular Updates**: Keep Docker and system packages updated

## SSL/HTTPS Setup (Production)

For production, set up SSL using Let's Encrypt:

1. Install Certbot:
   ```bash
   sudo apt-get install certbot
   ```

2. Install Nginx on host (as reverse proxy):
   ```bash
   sudo apt-get install nginx
   ```

3. Configure Nginx to proxy to Docker:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. Get SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Backup Database

```bash
# Create backup
docker compose exec postgres pg_dump -U postgres everest > backup_$(date +%Y%m%d).sql

# Restore backup
docker compose exec -T postgres psql -U postgres everest < backup_20240101.sql
```

## Monitoring

Set up monitoring with:

```bash
# View resource usage
docker stats

# View logs in real-time
docker compose logs -f

# Check container health
docker compose ps
```

## Support

For issues:
- Check logs: `docker compose logs -f`
- Review this documentation
- Check GitHub issues: https://github.com/zkyko/Everest/issues


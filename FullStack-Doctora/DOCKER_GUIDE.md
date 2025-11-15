# 🐳 Docker Deployment Guide

## Prerequisites

- Docker Desktop installed ([download here](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)

---

## 🚀 Quick Start

### Development Environment

```bash
# Start all services (database + backend)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

**Access:**
- Backend: http://localhost:8082
- Database: localhost:5435
- Frontend: Run separately with `npm run dev` (or include in compose)

---

### Production Environment

1. **Setup Environment Variables**

```bash
# Copy environment template
cp .env.docker .env

# Edit .env and update:
# - Strong JWT_SECRET
# - Strong DB_PASSWORD
# - Production ALLOWED_ORIGINS
```

2. **Build and Start**

```bash
# Build images and start all services
docker-compose -f docker-compose.production.yml up -d --build

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

3. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8082
- Database: localhost:5432

---

## 🔧 Docker Commands Cheat Sheet

### Building

```bash
# Build backend only
docker build -t doctora-backend ./doctora-spring-boot

# Build frontend only
docker build -t doctora-frontend ./FrontendDoctora

# Build with docker-compose
docker-compose -f docker-compose.production.yml build
```

### Running

```bash
# Start in background
docker-compose up -d

# Start and see logs
docker-compose up

# Start specific service
docker-compose up backend

# Rebuild and start
docker-compose up --build
```

### Monitoring

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View logs
docker logs doctora-backend-prod

# Follow logs
docker logs -f doctora-backend-prod

# View last 100 lines
docker logs --tail 100 doctora-backend-prod

# Check resource usage
docker stats
```

### Stopping

```bash
# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes data!)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### Debugging

```bash
# Execute command in running container
docker exec -it doctora-backend-prod sh

# View container details
docker inspect doctora-backend-prod

# Check health status
docker inspect --format='{{.State.Health.Status}}' doctora-backend-prod
```

### Cleaning Up

```bash
# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# Remove unused volumes
docker volume prune

# Clean everything (⚠️ careful!)
docker system prune -a --volumes
```

---

## 🔍 Testing the Deployment

### 1. Check Services Health

```bash
# Check all containers are running
docker-compose ps

# Expected output:
# NAME                   STATUS    PORTS
# doctora-backend-prod   Up        0.0.0.0:8082->8082/tcp
# doctora-frontend-prod  Up        0.0.0.0:3000->3000/tcp
# doctora-db-prod        Up        0.0.0.0:5432->5432/tcp
```

### 2. Test Backend API

```bash
# Test health endpoint
curl http://localhost:8082/api/specialties

# Should return JSON with specialties
```

### 3. Test Frontend

Open browser: http://localhost:3000

### 4. Check Logs

```bash
# Backend logs
docker logs doctora-backend-prod

# Look for:
# ✅ "Started DoctoraliaApplication"
# ✅ "Flyway migrations completed successfully"
# ❌ Any errors or stack traces
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Check logs:**
```bash
docker logs doctora-backend-prod
```

**Common causes:**
1. Database not ready
   - Solution: Wait 30 seconds and check again
   - Check: `docker logs doctora-db-prod`

2. Port 8082 already in use
   - Solution: Stop other services on port 8082
   - Check: `lsof -i :8082` (Mac/Linux)

3. Environment variables missing
   - Check: `docker exec doctora-backend-prod env`

### Issue: Frontend won't connect to backend

**Check:**
1. CORS configuration
   ```bash
   # View backend logs for CORS errors
   docker logs doctora-backend-prod | grep CORS
   ```

2. API URL in frontend
   ```bash
   docker exec doctora-frontend-prod env | grep API_BASE_URL
   ```

3. Network connectivity
   ```bash
   # From frontend container, test backend
   docker exec doctora-frontend-prod wget -O- http://backend:8082/api/specialties
   ```

### Issue: Database connection failed

**Check database:**
```bash
# Check if database is running
docker ps | grep postgres

# Connect to database
docker exec -it doctora-db-prod psql -U admin -d doctorbook

# Inside psql, check tables:
\dt

# Should see: users, doctors, specialties, appointments, etc.
```

### Issue: Migrations not running

**Check Flyway logs:**
```bash
docker logs doctora-backend-prod | grep -i flyway
```

**Manually run migrations:**
```bash
# Connect to backend container
docker exec -it doctora-backend-prod sh

# Check migration status
# (If you have flyway CLI installed)
```

### Issue: Out of memory

**Check resources:**
```bash
docker stats
```

**Increase Docker memory:**
- Docker Desktop → Settings → Resources
- Increase Memory to at least 4GB

---

## 📊 Production Deployment

### Deploy to VPS (DigitalOcean, AWS EC2, etc.)

1. **Copy files to server:**
```bash
# Using scp
scp -r . user@server-ip:/home/user/doctora

# Or clone from git
git clone your-repo.git
```

2. **Install Docker on server:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Setup environment:**
```bash
cp .env.docker .env
nano .env  # Edit with production values
```

4. **Run:**
```bash
docker-compose -f docker-compose.production.yml up -d --build
```

5. **Setup Nginx (optional):**
```bash
# Install nginx
sudo apt install nginx

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/doctora
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

6. **Enable and restart nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/doctora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Security Best Practices

1. **Use secrets management**
   - Don't commit .env files
   - Use Docker secrets or environment variable injection

2. **Non-root user**
   - ✅ Already configured in Dockerfiles

3. **Update regularly**
   ```bash
   docker pull postgres:15-alpine
   docker-compose up -d --build
   ```

4. **Monitor logs**
   - Set up log aggregation (ELK, Grafana Loki)

5. **Backup database**
   ```bash
   # Backup
   docker exec doctora-db-prod pg_dump -U admin doctorbook > backup.sql

   # Restore
   docker exec -i doctora-db-prod psql -U admin doctorbook < backup.sql
   ```

---

## 📈 Monitoring

### View resource usage:
```bash
docker stats --no-stream
```

### Container health:
```bash
docker inspect --format='{{json .State.Health}}' doctora-backend-prod | jq
```

### Logs rotation:
Add to docker-compose:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 🔄 Update & Rollback

### Update application:
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build
```

### Rollback:
```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Start
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 💡 Tips

1. **Development workflow:**
   - Use `docker-compose.dev.yml` for local development
   - Frontend runs outside Docker for hot reload
   - Only backend + database in Docker

2. **Production workflow:**
   - Use `docker-compose.production.yml`
   - All services in Docker
   - Behind nginx reverse proxy

3. **Resource limits:**
   Add to docker-compose services:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
       reservations:
         memory: 512M
   ```

---

## ✅ Checklist Before Production

- [ ] Change default passwords
- [ ] Set strong JWT secret
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set up monitoring
- [ ] Test health checks
- [ ] Document deployment process
- [ ] Set up CI/CD pipeline

---

**Last Updated:** 2025-10-07

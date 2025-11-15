# 🚀 Deployment Guide - Doctora Application

## 📋 Prerequisites

- Git account (GitHub/GitLab)
- Node.js 20+ (for local testing)
- Java 21+ (for backend)
- PostgreSQL 15+ (or managed database service)

---

## 🔧 Step 1: Environment Configuration

### Backend Environment Variables

Create `.env` file in `doctora-spring-boot/` directory:

```bash
# Copy from example
cp .env.example .env
```

Required variables:
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Strong JWT secret (min 256 bits)
- `JWT_EXPIRATION` - Token expiration time (milliseconds)
- `SERVER_PORT` - Backend server port (default: 8082)
- `ALLOWED_ORIGINS` - Comma-separated frontend URLs

### Frontend Environment Variables

Create `.env.local` file in `FrontendDoctora/` directory:

```bash
# Copy from example
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

---

## 🎯 Deployment Options

### Option 1: Railway.app (Recommended for Quick Start)

#### Backend Deployment

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create New Project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Select `doctora-spring-boot` directory

3. **Add PostgreSQL Database**
   - In your project, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create and connect the database

4. **Configure Environment Variables**
   - Go to your backend service → "Variables"
   - Add all variables from `.env.production`:
     ```
     DB_HOST=${{Postgres.PGHOST}}
     DB_PORT=${{Postgres.PGPORT}}
     DB_NAME=${{Postgres.PGDATABASE}}
     DB_USERNAME=${{Postgres.PGUSER}}
     DB_PASSWORD=${{Postgres.PGPASSWORD}}
     JWT_SECRET=your-super-strong-secret-key-here
     JWT_EXPIRATION=86400000
     SERVER_PORT=8082
     ALLOWED_ORIGINS=https://your-frontend-url.railway.app
     SPRING_PROFILES_ACTIVE=prod
     ```

5. **Configure Build Settings**
   - Root Directory: `doctora-spring-boot`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/Doctoralia-0.0.1-SNAPSHOT.jar`

#### Frontend Deployment

1. **Create New Service**
   - In same project, click "New" → "GitHub Repo"
   - Select `FrontendDoctora` directory

2. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
   NODE_ENV=production
   ```

3. **Configure Build Settings**
   - Root Directory: `FrontendDoctora`
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Update Backend CORS**
   - Go back to backend service variables
   - Update `ALLOWED_ORIGINS` with your frontend Railway URL

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Backend on Render

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository
   - Select `doctora-spring-boot` directory

2. **Configure Service**
   - Name: `doctora-backend`
   - Environment: `Docker` or `Java`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/Doctoralia-0.0.1-SNAPSHOT.jar`

3. **Add PostgreSQL Database**
   - New → PostgreSQL
   - Note the connection details

4. **Environment Variables** (same as Railway above)

#### Frontend on Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Import Git Repository
   - Select your repository

2. **Configure Project**
   - Framework Preset: `Next.js`
   - Root Directory: `FrontendDoctora`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**

---

### Option 3: AWS (Production-Grade)

#### Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed

#### Backend: Elastic Beanstalk

1. **Create Application**
   ```bash
   eb init doctora-backend --platform java-21 --region ap-southeast-1
   ```

2. **Create Environment**
   ```bash
   eb create production-env
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv DB_HOST=your-rds-endpoint \
     DB_NAME=doctorbook \
     JWT_SECRET=your-secret \
     ALLOWED_ORIGINS=https://your-frontend.com
   ```

#### Frontend: Amplify or S3 + CloudFront

1. **Using Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Set Environment Variables in Amplify Console**

#### Database: RDS PostgreSQL

1. Create RDS instance in AWS Console
2. Note connection details
3. Update backend environment variables

---

## 🔒 Security Checklist

- [ ] Change default JWT secret to strong random string (min 256 bits)
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domains only
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Disable debug logging in production
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts

---

## 🧪 Testing Deployment

### Backend Health Check

```bash
curl https://your-backend-url.com/api/specialties
```

Expected: List of specialties

### Frontend Test

1. Open browser to your frontend URL
2. Try to register/login
3. Check browser console for errors
4. Test booking flow

---

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem:** Frontend can't connect to backend

**Solution:**
- Check `ALLOWED_ORIGINS` includes your frontend URL
- Verify no trailing slashes in URLs
- Check HTTPS vs HTTP

#### 2. Database Connection Failed
**Problem:** Backend can't connect to database

**Solution:**
- Verify database credentials
- Check firewall rules
- Ensure database is running
- Verify connection string format

#### 3. JWT Token Invalid
**Problem:** Authentication not working

**Solution:**
- Verify `JWT_SECRET` is set and matches
- Check token expiration time
- Clear browser localStorage

#### 4. Build Failures
**Problem:** Deployment fails during build

**Solution:**
- Check build logs
- Verify Node.js/Java versions
- Run build locally first
- Check dependencies in package.json/pom.xml

---

## 📊 Monitoring

### Railway
- Built-in metrics in dashboard
- View logs in real-time

### Render
- Metrics tab shows CPU/Memory
- Logs tab for application logs

### AWS
- CloudWatch for logs and metrics
- Set up alarms for errors

---

## 💰 Cost Estimates

### Railway (Recommended for Students)
- Free: $5 credit/month (500 hours)
- Hobby: $5/month per service
- **Estimated:** $10-20/month (Backend + Frontend + Database)

### Vercel + Render
- Vercel: Free for hobby projects
- Render: Free tier (with limitations)
- **Estimated:** Free - $10/month

### AWS
- Free tier: First 12 months
- After free tier: $20-50/month
- **Estimated:** $20-50/month

---

## 🎓 Best Practices

1. **Use Environment Variables** - Never hardcode credentials
2. **Enable Logging** - Monitor application behavior
3. **Set Up CI/CD** - Automate deployments
4. **Database Backups** - Regular automated backups
5. **Version Control** - Tag releases
6. **Documentation** - Keep this guide updated
7. **Testing** - Test before deploying to production

---

## 📞 Support

- **Railway:** [docs.railway.app](https://docs.railway.app)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Render:** [render.com/docs](https://render.com/docs)
- **AWS:** [aws.amazon.com/documentation](https://aws.amazon.com/documentation)

---

## 📝 Next Steps

1. ✅ Environment files created
2. ⏳ Create Dockerfiles (Optional but recommended)
3. ⏳ Set up CI/CD pipeline
4. ⏳ Configure custom domain
5. ⏳ Set up SSL certificates
6. ⏳ Configure monitoring and alerts

---

## 🔄 Quick Deploy Commands

### Local Development
```bash
# Backend
cd doctora-spring-boot
./mvnw spring-boot:run

# Frontend
cd FrontendDoctora
npm run dev
```

### Build for Production
```bash
# Backend
cd doctora-spring-boot
./mvnw clean package -DskipTests

# Frontend
cd FrontendDoctora
npm run build
npm start
```

---

**Last Updated:** 2025-10-07
**Version:** 1.0.0

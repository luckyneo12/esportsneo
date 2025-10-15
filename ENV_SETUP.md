# 🔧 Environment Variables Setup

## Frontend (.env.local)

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# For production
# NEXT_PUBLIC_API_URL=https://api.esportsneo.com/api
```

---

## Backend (.env)

Create a `.env` file in your backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=8000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=esportsneo

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@esportsneo.com

# Notification Configuration
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_PUSH_NOTIFICATIONS=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_SECRET=your_session_secret_here
SESSION_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Super Admin (First User)
SUPER_ADMIN_EMAIL=admin@esportsneo.com
SUPER_ADMIN_PASSWORD=change_this_password
SUPER_ADMIN_MOBILE=+919999999999
```

---

## Production Environment Variables

### **Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://api.esportsneo.com/api
```

### **Backend:**
```env
NODE_ENV=production
PORT=8000

# Use production database
DB_HOST=your-production-db-host
DB_USER=production_user
DB_PASSWORD=strong_production_password
DB_NAME=esportsneo_prod

# Strong JWT secret
JWT_SECRET=use_a_very_strong_random_string_here

# Production URLs
FRONTEND_URL=https://esportsneo.com
ALLOWED_ORIGINS=https://esportsneo.com,https://www.esportsneo.com

# Enable features
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_PUSH_NOTIFICATIONS=true

# Stricter rate limiting
RATE_LIMIT_MAX_REQUESTS=50
```

---

## Environment Variables Checklist

### **Required (Frontend):**
- [x] `NEXT_PUBLIC_API_URL` - Backend API URL

### **Required (Backend):**
- [x] `NODE_ENV` - Environment (development/production)
- [x] `PORT` - Server port
- [x] `DB_HOST` - Database host
- [x] `DB_USER` - Database user
- [x] `DB_PASSWORD` - Database password
- [x] `DB_NAME` - Database name
- [x] `JWT_SECRET` - JWT secret key
- [x] `FRONTEND_URL` - Frontend URL for CORS

### **Optional (Backend):**
- [ ] `SMTP_*` - Email configuration
- [ ] `UPLOAD_DIR` - Custom upload directory
- [ ] `MAX_FILE_SIZE` - Max file size limit
- [ ] `RATE_LIMIT_*` - Rate limiting config
- [ ] `LOG_*` - Logging configuration

---

## Security Best Practices

### **1. JWT Secret:**
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **2. Database Password:**
- Use strong passwords (16+ characters)
- Mix uppercase, lowercase, numbers, symbols
- Never commit to git

### **3. CORS:**
- Only allow trusted origins
- Update `ALLOWED_ORIGINS` in production

### **4. File Uploads:**
- Limit file size (5MB recommended)
- Validate file types
- Scan for malware (optional)

### **5. Rate Limiting:**
- Adjust based on traffic
- Lower limits for production
- Monitor for abuse

---

## Setup Instructions

### **1. Frontend Setup:**
```bash
# Copy environment file
cp ENV_SETUP.md .env.local

# Edit .env.local
# Set NEXT_PUBLIC_API_URL

# Install dependencies
npm install

# Run development server
npm run dev
```

### **2. Backend Setup:**
```bash
# Create .env file
touch .env

# Add all required variables
# (Copy from Backend section above)

# Install dependencies
npm install

# Run migrations (if using)
npm run migrate

# Seed super admin (optional)
npm run seed:admin

# Start server
npm run dev
```

---

## Testing Environment Variables

### **Test if variables are loaded:**

**Frontend:**
```javascript
// In any component
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

**Backend:**
```javascript
// In server.js
console.log('Environment:', process.env.NODE_ENV);
console.log('Database:', process.env.DB_NAME);
console.log('JWT Secret:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
```

---

## Common Issues

### **Issue 1: API URL not working**
```
Solution: Make sure variable starts with NEXT_PUBLIC_
Restart dev server after changing .env.local
```

### **Issue 2: Database connection failed**
```
Solution: Check DB credentials
Ensure MySQL is running
Verify database exists
```

### **Issue 3: JWT errors**
```
Solution: Ensure JWT_SECRET is set
Use strong secret (32+ characters)
Check token expiration
```

### **Issue 4: File upload fails**
```
Solution: Check UPLOAD_DIR exists
Verify file permissions
Check MAX_FILE_SIZE
```

---

## Environment-Specific Configs

### **Development:**
- Detailed error messages
- Verbose logging
- Relaxed CORS
- Lower rate limits

### **Production:**
- Generic error messages
- Error logging only
- Strict CORS
- Higher rate limits
- Enable caching
- Use CDN for uploads

---

## Quick Reference

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Backend (Minimal)
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=esportsneo
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

---

**Environment Setup Complete! 🚀**

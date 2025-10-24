# ⚡ Quick Start - 5 Minutes Setup

## 🎯 Super Fast Upload Guide

### Step 1: Create ZIP (30 seconds)
```
Right-click "laravel-backend" folder → Send to → Compressed folder
```

### Step 2: Upload to Hostinger (2 minutes)
1. Login to cPanel
2. File Manager → Navigate to subdomain folder
3. Upload ZIP
4. Extract ZIP
5. Delete ZIP file

### Step 3: Setup Database (1 minute)
1. cPanel → MySQL Databases
2. Create database: `esportsneo`
3. Create user: `esportsneo_user` (with password)
4. Add user to database (ALL PRIVILEGES)

### Step 4: Configure .env (1 minute)
Edit `.env` file:
```env
DB_DATABASE=username_esportsneo
DB_USERNAME=username_esportsneo_user
DB_PASSWORD=your_password
APP_URL=https://api.esportsneo.techbranzzo.com
```

### Step 5: Run Commands (1 minute)
```bash
cd ~/api.esportsneo.techbranzzo.com
composer install --no-dev
php artisan key:generate
php artisan jwt:secret
php artisan migrate
chmod -R 755 storage bootstrap/cache
php artisan config:cache
```

### Step 6: Set Document Root (30 seconds)
cPanel → Subdomains → Edit → Document Root:
```
/home/username/api.esportsneo.techbranzzo.com/public
```

### Step 7: Test! ✅
```
https://api.esportsneo.techbranzzo.com/api/auth/register
```

---

## 🚨 Common Issues - Quick Fixes

### 403 Error?
```bash
# Document root must point to public folder
# cPanel → Subdomains → Edit Document Root
```

### 500 Error?
```bash
php artisan config:clear
chmod -R 755 storage
```

### Database Error?
```bash
# Check .env database credentials
# Try DB_HOST=127.0.0.1 instead of localhost
```

---

## ✅ Done!

Your API is live at: `https://api.esportsneo.techbranzzo.com/api/`

**55+ Endpoints Ready to Use!** 🚀

---

## 📚 Full Documentation

- **UPLOAD_INSTRUCTIONS.md** - Detailed step-by-step guide
- **DASHBOARD_XP_SYSTEM.md** - Dashboard & XP system docs
- **COMPLETE_FEATURES_LIST.md** - All features list
- **README.md** - Complete overview

---

**Need help? Check UPLOAD_INSTRUCTIONS.md for detailed guide!**

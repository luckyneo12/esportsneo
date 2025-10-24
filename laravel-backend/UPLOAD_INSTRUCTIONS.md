# 🚀 Upload Instructions for Hostinger

## ✅ Complete Ready-to-Upload Package

Maine tumhare liye complete Laravel backend ready kar diya hai!

---

## 📦 Step 1: Create ZIP File

### Local Machine Pe (Windows):

1. **Open PowerShell** in `laravel-backend` folder
2. Run this command:

```powershell
Compress-Archive -Path * -DestinationPath esportsneo-backend.zip
```

**Ya manually:**
- Right-click `laravel-backend` folder
- Send to → Compressed (zipped) folder
- Rename to `esportsneo-backend.zip`

---

## 🌐 Step 2: Upload to Hostinger

### Method A: Via cPanel File Manager (Easiest)

1. **Login to Hostinger cPanel**
   - Go to: https://hpanel.hostinger.com

2. **Open File Manager**
   - cPanel → File Manager

3. **Navigate to Subdomain Folder**
   - Go to: `/home/username/api.esportsneo.techbranzzo.com/`
   - (Ya jo bhi tumhara subdomain path hai)

4. **Upload ZIP**
   - Click "Upload" button
   - Select `esportsneo-backend.zip`
   - Wait for upload to complete

5. **Extract ZIP**
   - Right-click on `esportsneo-backend.zip`
   - Click "Extract"
   - Extract to current directory
   - Delete ZIP file after extraction

---

## ⚙️ Step 3: Configure Database

### Create Database:

1. **cPanel → MySQL Databases**

2. **Create New Database:**
   - Database Name: `esportsneo` (ya koi bhi naam)
   - Click "Create Database"

3. **Create Database User:**
   - Username: `esportsneo_user`
   - Password: (strong password - save it!)
   - Click "Create User"

4. **Add User to Database:**
   - Select User: `esportsneo_user`
   - Select Database: `esportsneo`
   - Click "Add"
   - Grant ALL PRIVILEGES
   - Click "Make Changes"

---

## 📝 Step 4: Configure .env File

1. **File Manager me `.env` file edit karo:**

```env
APP_NAME=EsportsNeo
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.esportsneo.techbranzzo.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=username_esportsneo
DB_USERNAME=username_esportsneo_user
DB_PASSWORD=your_database_password

JWT_SECRET=
JWT_TTL=10080
JWT_REFRESH_TTL=20160
JWT_ALGO=HS256
```

**Important:**
- Replace `username_esportsneo` with actual database name
- Replace `username_esportsneo_user` with actual username
- Replace `your_database_password` with actual password
- `APP_KEY` and `JWT_SECRET` will be generated in next step

---

## 🔧 Step 5: Run Setup Commands

### Via SSH (Recommended):

```bash
# Connect to SSH
ssh username@yourdomain.com

# Navigate to project
cd ~/api.esportsneo.techbranzzo.com

# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate APP_KEY
php artisan key:generate

# Generate JWT_SECRET
php artisan jwt:secret

# Run migrations
php artisan migrate

# Set permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Cache config
php artisan config:cache
php artisan route:cache
```

### Via cPanel Terminal (Alternative):

1. cPanel → Terminal
2. Run same commands as above

---

## 🔐 Step 6: Set Permissions

### Via File Manager:

1. Right-click `storage` folder → Permissions → **755**
2. Right-click `bootstrap/cache` folder → Permissions → **755**

### Via Terminal:

```bash
find ~/api.esportsneo.techbranzzo.com -type d -exec chmod 755 {} \;
find ~/api.esportsneo.techbranzzo.com -type f -exec chmod 644 {} \;
chmod -R 755 ~/api.esportsneo.techbranzzo.com/storage
chmod -R 755 ~/api.esportsneo.techbranzzo.com/bootstrap/cache
```

---

## 🎯 Step 7: Configure Subdomain Document Root

### Important: Point to Public Folder

1. **cPanel → Subdomains**
2. Find: `api.esportsneo.techbranzzo.com`
3. Click **"Manage"** or **"Edit"**
4. Change **Document Root** to:
   ```
   /home/username/api.esportsneo.techbranzzo.com/public
   ```
5. Click **"Save"**

**This is VERY IMPORTANT!**

---

## 🧪 Step 8: Test Your API

### Test in Browser:

```
https://api.esportsneo.techbranzzo.com/api/auth/register
```

**Expected Response:**
```json
{
  "error": "The name field is required."
}
```

This means API is working! ✅

### Test with cURL:

```bash
curl -X POST https://api.esportsneo.techbranzzo.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "mobile": "1234567890",
    "password": "password123"
  }'
```

---

## 📋 Quick Checklist

- [ ] ZIP file created
- [ ] Uploaded to Hostinger
- [ ] Extracted files
- [ ] Database created
- [ ] Database user created
- [ ] `.env` file configured
- [ ] `composer install` run
- [ ] `php artisan key:generate` run
- [ ] `php artisan jwt:secret` run
- [ ] Migrations run (`php artisan migrate`)
- [ ] Permissions set (755)
- [ ] Document root points to `public` folder
- [ ] API tested and working

---

## 🐛 Troubleshooting

### 403 Forbidden Error
**Fix:**
- Make sure document root points to `public` folder
- Check `.htaccess` files exist
- Check permissions (755 for folders, 644 for files)

### 500 Internal Server Error
**Fix:**
```bash
# Enable debug temporarily
# Edit .env: APP_DEBUG=true

# Check logs
tail -f storage/logs/laravel.log

# Clear cache
php artisan config:clear
php artisan cache:clear
```

### Database Connection Error
**Fix:**
- Verify database credentials in `.env`
- Try `DB_HOST=127.0.0.1` instead of `localhost`
- Check database user has privileges

### Composer Not Found
**Fix:**
```bash
# Use full path
/usr/local/bin/php /usr/local/bin/composer install --optimize-autoloader --no-dev
```

### JWT Secret Not Set
**Fix:**
```bash
php artisan jwt:secret --force
```

---

## 📱 Connect Frontend

### Update Frontend API URL:

```typescript
// In your Next.js app
const API_BASE_URL = 'https://api.esportsneo.techbranzzo.com/api';

// Example usage
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mobile: '1234567890',
    password: 'password123'
  })
});
```

---

## ✅ Final Structure on Server

```
/home/username/api.esportsneo.techbranzzo.com/
├── app/
├── bootstrap/
├── config/
├── database/
│   └── migrations/
├── public/              ← Document Root points here
│   ├── index.php
│   └── .htaccess
├── routes/
│   └── api.php
├── storage/
├── vendor/
├── .env
├── .htaccess
├── artisan
└── composer.json
```

---

## 🎉 You're Done!

Your Laravel backend is now live at:
```
https://api.esportsneo.techbranzzo.com/api/
```

### Available Endpoints:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- GET `/api/towers`
- GET `/api/tournaments`
- And 50+ more!

---

## 📞 Need Help?

Agar koi issue aaye to:
1. Check error logs: `storage/logs/laravel.log`
2. Enable debug: `APP_DEBUG=true` in `.env`
3. Clear cache: `php artisan config:clear`

**Happy Coding! 🚀**

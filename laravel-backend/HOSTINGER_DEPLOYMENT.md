# 🚀 Hostinger Deployment Guide - Complete Steps

## 📦 Step 1: Prepare Laravel Project Locally

### Install Laravel & Dependencies
```bash
composer create-project laravel/laravel esportsneo-backend
cd esportsneo-backend

# Install JWT Auth
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### Copy All Files
1. Copy all migration files from `database/migrations/` folder
2. Copy all model files from `app/Models/` folder
3. Copy all controller files from `app/Http/Controllers/` folder
4. Copy `routes/api.php` file
5. Copy `config/auth.php` file

### Configure .env
```env
APP_NAME=EsportsNeo
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_here
```

### Run Migrations Locally (Test)
```bash
php artisan migrate
php artisan serve
```

Test APIs at: `http://localhost:8000/api/`

---

## 🌐 Step 2: Upload to Hostinger

### Method 1: Via File Manager (Easiest)
1. **Compress your Laravel project**
   ```bash
   zip -r esportsneo-backend.zip esportsneo-backend/
   ```

2. **Login to Hostinger cPanel**
   - Go to File Manager
   - Navigate to `public_html` (or create subdirectory like `public_html/api`)
   - Upload `esportsneo-backend.zip`
   - Extract the ZIP file

3. **Move files to correct location**
   - Move all Laravel files to root directory
   - Keep only `public` folder contents in `public_html`

### Method 2: Via FTP
1. Use FileZilla or any FTP client
2. Connect with Hostinger FTP credentials
3. Upload entire Laravel project

---

## 🗄️ Step 3: Setup Database on Hostinger

### Create MySQL Database
1. Go to **cPanel → MySQL Databases**
2. **Create New Database**
   - Database Name: `esportsneo`
3. **Create Database User**
   - Username: `esportsneo_user`
   - Password: (strong password)
4. **Add User to Database**
   - Select user and database
   - Grant ALL PRIVILEGES

### Import Database Schema
**Option A: Via phpMyAdmin**
1. Go to **cPanel → phpMyAdmin**
2. Select your database
3. Go to **Import** tab
4. Upload SQL file or run migrations

**Option B: Via SSH (if available)**
```bash
cd /home/username/public_html/api
php artisan migrate
```

---

## ⚙️ Step 4: Configure Laravel on Hostinger

### Update .env File
1. Go to File Manager
2. Find `.env` file in Laravel root
3. Edit with correct values:

```env
APP_NAME=EsportsNeo
APP_ENV=production
APP_KEY=base64:your_generated_key_here
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=esportsneo_db
DB_USERNAME=esportsneo_user
DB_PASSWORD=your_strong_password

JWT_SECRET=your_jwt_secret_from_local
```

### Generate APP_KEY (if needed)
```bash
php artisan key:generate
```

### Create .htaccess in Root
Create `.htaccess` in Laravel root directory:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### Update public/.htaccess
Make sure `public/.htaccess` has:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 🔐 Step 5: Set Permissions

### Via File Manager
1. Right-click on `storage` folder → Permissions → 755
2. Right-click on `bootstrap/cache` → Permissions → 755

### Via SSH
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

---

## 🚀 Step 6: Optimize Laravel

### Via SSH (Recommended)
```bash
cd /home/username/public_html/api
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

### Via cPanel Terminal
- Go to **cPanel → Terminal**
- Run same commands as above

---

## 🧪 Step 7: Test Your API

### Test Endpoints
```bash
# Register
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "mobile": "1234567890",
    "password": "password123"
  }'

# Login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "1234567890",
    "password": "password123"
  }'
```

### Common Test URLs
- Register: `https://yourdomain.com/api/auth/register`
- Login: `https://yourdomain.com/api/auth/login`
- Get User: `https://yourdomain.com/api/auth/me`
- Towers: `https://yourdomain.com/api/towers`
- Tournaments: `https://yourdomain.com/api/tournaments`

---

## 🔧 Troubleshooting

### Error: 500 Internal Server Error
**Solution:**
1. Check `.env` file is configured correctly
2. Check database credentials
3. Run `php artisan config:clear`
4. Check storage permissions (755)

### Error: JWT Secret Not Set
**Solution:**
```bash
php artisan jwt:secret
```

### Error: Database Connection Failed
**Solution:**
1. Verify database name, username, password in `.env`
2. Check if database user has privileges
3. Try `DB_HOST=127.0.0.1` instead of `localhost`

### Error: Class Not Found
**Solution:**
```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

### Error: CORS Issues
**Solution:**
Install Laravel CORS package:
```bash
composer require fruitcake/laravel-cors
```

Add to `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

---

## 📱 Step 8: Connect Frontend

### Update Frontend API URL
In your Next.js frontend, update API base URL:

```typescript
// lib/api.ts
const API_BASE_URL = 'https://yourdomain.com/api';
```

### Update All API Calls
Change from:
```typescript
fetch('/api/auth/login', ...)
```

To:
```typescript
fetch('https://yourdomain.com/api/auth/login', ...)
```

---

## ✅ Final Checklist

- [ ] Laravel project uploaded to Hostinger
- [ ] Database created and configured
- [ ] Migrations run successfully
- [ ] .env file configured with correct values
- [ ] Storage permissions set to 755
- [ ] .htaccess files in place
- [ ] Config cached (`php artisan config:cache`)
- [ ] API endpoints tested and working
- [ ] Frontend connected to backend URL
- [ ] CORS configured (if needed)

---

## 🎉 You're Done!

Your Laravel backend is now live on Hostinger!

**API Base URL:** `https://yourdomain.com/api`

**Available Endpoints:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- GET `/api/towers`
- POST `/api/towers`
- GET `/api/tournaments`
- And 30+ more endpoints!

---

## 📞 Need Help?

If you face any issues:
1. Check Hostinger error logs in cPanel
2. Enable `APP_DEBUG=true` temporarily to see errors
3. Check Laravel logs in `storage/logs/laravel.log`

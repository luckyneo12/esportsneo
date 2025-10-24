# Laravel Backend Setup for EsportsNeo

## 📋 Overview
Complete Laravel backend API for EsportsNeo platform that can be hosted on Hostinger.

## 🚀 Quick Setup

### Step 1: Install Laravel
```bash
composer create-project laravel/laravel esportsneo-backend
cd esportsneo-backend
```

### Step 2: Install Required Packages
```bash
composer require tymon/jwt-auth
composer require laravel/sanctum
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### Step 3: Configure Database
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=esportsneo
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_here
```

### Step 4: Run Migrations
```bash
php artisan migrate
```

### Step 5: Start Development Server
```bash
php artisan serve
```

## 📁 Project Structure

```
esportsneo-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── TowerController.php
│   │   │   ├── TeamController.php
│   │   │   ├── TournamentController.php
│   │   │   ├── LeaderboardController.php
│   │   │   └── AdminController.php
│   │   └── Middleware/
│   │       └── JwtMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Tower.php
│       ├── Team.php
│       ├── Tournament.php
│       └── TournamentRegistration.php
├── database/
│   └── migrations/
├── routes/
│   └── api.php
└── .env
```

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users/{id}` - Get user profile
- PUT `/api/users/{id}` - Update user profile
- GET `/api/users/{id}/stats` - Get user stats
- GET `/api/users/search` - Search users

### Towers
- GET `/api/towers` - Get all towers
- POST `/api/towers` - Create tower
- GET `/api/towers/{id}` - Get tower details
- PUT `/api/towers/{id}` - Update tower
- DELETE `/api/towers/{id}` - Delete tower
- POST `/api/towers/join` - Join tower

### Teams
- GET `/api/teams` - Get all teams
- POST `/api/teams` - Create team
- GET `/api/teams/{id}` - Get team details
- PUT `/api/teams/{id}` - Update team
- DELETE `/api/teams/{id}` - Delete team

### Tournaments
- GET `/api/tournaments` - Get all tournaments
- POST `/api/tournaments` - Create tournament
- GET `/api/tournaments/{id}` - Get tournament details
- PUT `/api/tournaments/{id}` - Update tournament
- DELETE `/api/tournaments/{id}` - Delete tournament
- POST `/api/tournaments/{id}/register` - Register team
- GET `/api/tournaments/{id}/registrations` - Get registrations
- PATCH `/api/tournaments/{id}/room` - Update room details
- POST `/api/tournaments/{id}/send-room-details` - Send room details

### Leaderboard
- GET `/api/leaderboard/players` - Get player leaderboard
- GET `/api/leaderboard/teams` - Get team leaderboard
- GET `/api/leaderboard/towers` - Get tower leaderboard

### Admin
- GET `/api/admin/stats/users` - Get user statistics
- GET `/api/admin/stats/tournaments` - Get tournament statistics
- GET `/api/admin/stats/towers` - Get tower statistics
- GET `/api/admin/organizer/applications` - Get organizer applications
- PATCH `/api/admin/organizer/applications/{id}` - Update application status

### Organizer
- POST `/api/organizer/apply` - Apply for organizer role
- GET `/api/organizer/my-application` - Get my application
- GET `/api/organizer/tournaments` - Get my tournaments

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer {token}
```

## 📦 Hostinger Deployment

### Step 1: Upload Files
1. Compress your Laravel project (zip)
2. Upload to Hostinger via File Manager
3. Extract in `public_html` or subdirectory

### Step 2: Configure .htaccess
Create/update `.htaccess` in root:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### Step 3: Set Permissions
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### Step 4: Configure Database
- Create MySQL database in Hostinger cPanel
- Update `.env` with database credentials
- Run migrations via SSH or import SQL

### Step 5: Optimize
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🔧 Environment Variables for Hostinger

```env
APP_NAME=EsportsNeo
APP_ENV=production
APP_KEY=base64:your_app_key_here
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_here
JWT_TTL=10080
```

## 📝 Next Steps

1. I'll create all the migration files
2. I'll create all the models with relationships
3. I'll create all the controllers
4. I'll create the routes file
5. I'll create middleware for authentication

Ready to proceed? 🚀

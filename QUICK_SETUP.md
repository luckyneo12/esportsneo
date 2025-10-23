# 🚀 Quick Setup Guide - EsportsNeo

## Complete Backend Integration Done! ✅

Aapka pura backend ab Next.js ke andar hi hai. Alag se backend server ki zarurat nahi hai!

## 📦 Step 1: Install Dependencies

```bash
npm install
```

Ye install karega:
- `mysql2` - MySQL database ke liye
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication tokens
- `uuid` - Unique IDs generate karne ke liye

## 🗄️ Step 2: MySQL Database Setup

### Option A: Command Line se

```bash
# MySQL me login karo
mysql -u root -p

# Database create karo
CREATE DATABASE esportsneo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Schema run karo
mysql -u root -p esportsneo < database/schema.sql
```

### Option B: MySQL Workbench se

1. MySQL Workbench open karo
2. New Query tab me `database/schema.sql` file open karo
3. Execute karo (⚡ button)

## ⚙️ Step 3: Environment Variables

`.env.local` file banao project root me:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=apna_mysql_password_yahan_daalo
DB_NAME=esportsneo

# JWT Secret (koi bhi random string daalo)
JWT_SECRET=koi-bhi-secret-key-yahan-daalo-production-me-change-karna

# Frontend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 🎯 Step 4: Start Development Server

```bash
npm run dev
```

Server start ho jayega: `http://localhost:3000`

## ✅ Testing

### 1. Register New User
```
URL: http://localhost:3000/auth/signup
Fill the form and submit
```

### 2. Login
```
URL: http://localhost:3000/auth/login
Use mobile: 9876543210 (jo register kiya)
Password: jo set kiya tha
```

### 3. Check Database
```sql
USE esportsneo;
SELECT * FROM users;
```

## 📁 Project Structure

```
esportsne_main/
├── app/
│   ├── api/                    # Backend API Routes
│   │   ├── auth/              # Login, Register, Me
│   │   ├── users/             # User Profile, Stats, Search
│   │   ├── towers/            # Tower CRUD, Join
│   │   ├── teams/             # Team CRUD
│   │   ├── tournaments/       # Tournament CRUD, Register
│   │   └── organizer/         # Organizer Applications
│   └── auth/                  # Frontend Auth Pages
├── lib/
│   ├── db.ts                  # Database Connection
│   ├── auth.ts                # JWT & Password Utils
│   ├── upload.ts              # File Upload Handler
│   └── utils/
│       └── codeGenerator.ts   # Tower Code Generator
├── database/
│   └── schema.sql             # Complete Database Schema
└── public/
    └── uploads/               # Uploaded Files (auto-created)
        ├── avatars/
        ├── logos/
        ├── banners/
        └── teams/
```

## 🔌 API Endpoints

Sab endpoints `/api/` se start hote hain:

### Authentication
- `POST /api/auth/register` - Naya user banao
- `POST /api/auth/login` - Login karo
- `GET /api/auth/me` - Current user info

### Users
- `GET /api/users/[id]` - User profile dekho
- `PUT /api/users/[id]` - Profile update karo
- `GET /api/users/[id]/stats` - User stats
- `GET /api/users/search?q=name` - Users search karo

### Towers
- `GET /api/towers` - Sab towers
- `POST /api/towers` - Naya tower banao
- `GET /api/towers/[id]` - Tower details
- `PUT /api/towers/[id]` - Tower update
- `DELETE /api/towers/[id]` - Tower delete
- `POST /api/towers/join` - Code se join karo

### Teams
- `GET /api/teams` - Sab teams
- `POST /api/teams` - Naya team banao
- `GET /api/teams/[id]` - Team details
- `PUT /api/teams/[id]` - Team update
- `DELETE /api/teams/[id]` - Team delete

### Tournaments
- `GET /api/tournaments` - Sab tournaments
- `POST /api/tournaments` - Naya tournament banao
- `GET /api/tournaments/[id]` - Tournament details
- `POST /api/tournaments/[id]/register` - Teams register karo
- `GET /api/tournaments/[id]/teams` - Registered teams

### Organizer
- `POST /api/organizer/apply` - Organizer ke liye apply karo
- `GET /api/organizer/my-application` - Application status

## 🔐 Authentication

Protected endpoints ke liye token chahiye:

```javascript
fetch('/api/towers', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

Token login/register se milta hai aur localStorage me save hota hai.

## 📸 File Uploads

Images upload karne ke liye FormData use karo:

```javascript
const formData = new FormData();
formData.append('name', 'Tower Name');
formData.append('logo', fileInput.files[0]);

fetch('/api/towers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
```

## 🐛 Common Issues

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Fix:** MySQL running hai? Credentials sahi hain `.env.local` me?

### JWT Error
```
Error: Invalid token
```
**Fix:** `.env.local` me `JWT_SECRET` set hai?

### File Upload Error
```
Error: ENOENT: no such file or directory
```
**Fix:** `public/uploads/` folder automatically ban jayega first upload pe

## 📚 Documentation Files

- `BACKEND_IMPLEMENTATION.md` - Complete backend details
- `DATABASE_SETUP.md` - Database setup guide
- `API_REFERENCE.md` - All API endpoints documentation
- `database/schema.sql` - Database structure

## 🎮 Features

✅ User Registration & Login
✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Tower Creation & Management
✅ Team Creation with Logo Upload
✅ Tournament Creation & Registration
✅ File Upload (Images)
✅ Role-based Access (Player, Tower Owner, Organizer, Admin)
✅ Search Functionality
✅ User Statistics
✅ Organizer Applications

## 🚀 Production Deployment

Production me deploy karne se pehle:

1. Strong `JWT_SECRET` use karo
2. Database credentials secure rakho
3. HTTPS enable karo
4. File upload limits set karo
5. Rate limiting add karo
6. Database backups setup karo

## 💡 Tips

- Frontend pages already updated hain to use `/api/*` endpoints
- No CORS issues kyunki sab same origin pe hai
- Images `public/uploads/` me save hote hain
- Database me JSON fields hain (co_leaders, members, etc.)
- All passwords hashed hain with bcrypt
- JWT tokens 7 days me expire hote hain

## 🎉 Ready to Go!

Ab aap apna complete esports platform use kar sakte ho. Sab kuch ek hi project me hai - frontend aur backend dono!

**Happy Coding! 🚀**

# 🚀 Quick Start Guide - Tournament System

## 📋 Setup Steps

### 1️⃣ Environment Configuration
```bash
# Create .env.local file in root directory
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2️⃣ Install & Run
```bash
npm install
npm run dev
```

### 3️⃣ Access Pages
- **Home**: http://localhost:3000
- **Tournaments**: http://localhost:3000/tournaments
- **Towers**: http://localhost:3000/towers
- **Create Tournament**: http://localhost:3000/tournaments/create
- **Create Tower**: http://localhost:3000/towers/create

---

## 🎯 User Flows

### **Admin/Organiser Flow:**
1. Login → Dashboard
2. Create Tournament (`/tournaments/create`)
3. Fill details (title, game, description, max teams)
4. Upload banner/logo (optional)
5. Submit → Tournament created
6. Approve/reject team registrations

### **Tower Owner Flow:**
1. Login → Create Tower (`/towers/create`)
2. Get unique join code
3. Create Teams (`/towers/[id]/teams/create`)
   - Add team name
   - Upload logo (required)
   - Add members & select captain
4. Register teams to tournament (`/towers/[id]/register`)
5. Wait for admin approval

### **Player Flow:**
1. Login → Join Tower (using code)
2. Get added to teams by tower owner
3. Participate in tournaments

---

## 📁 File Structure

```
app/
├── tournaments/
│   ├── page.tsx              # Tournaments listing
│   ├── create/page.tsx       # Create tournament
│   └── [id]/page.tsx         # Tournament details (TODO)
├── towers/
│   ├── page.tsx              # Towers listing
│   ├── create/page.tsx       # Create tower
│   └── [id]/
│       ├── page.tsx          # Tower details
│       ├── teams/create/page.tsx  # Create team
│       └── register/page.tsx      # Register to tournament
└── profile/
    └── [id]/page.tsx         # User profile

lib/
├── api.ts                    # API service layer
├── types.ts                  # TypeScript types
└── utils.ts                  # Utility functions

components/
└── main_components/
    └── Navbar.tsx            # Updated with Towers link
```

---

## 🔌 Backend API Endpoints Required

### **Tournaments**
```
GET    /api/tournaments
GET    /api/tournaments/:id
POST   /api/tournaments
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
GET    /api/tournaments/:id/teams
PATCH  /api/tournaments/:id/teams/:teamId
```

### **Towers**
```
GET    /api/towers
GET    /api/towers/:id
POST   /api/towers
PUT    /api/towers/:id
DELETE /api/towers/:id
POST   /api/towers/join
POST   /api/towers/:id/register-teams
POST   /api/towers/:id/co-leaders
DELETE /api/towers/:id/co-leaders/:userId
```

### **Teams**
```
GET    /api/teams
GET    /api/teams/:id
POST   /api/teams
PUT    /api/teams/:id
DELETE /api/teams/:id
POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:userId
```

### **Users**
```
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/search?q=query
```

---

## ✅ Validation Checklist

### **Tournament Registration:**
- [ ] Check if team already registered (no duplicates)
- [ ] Check tournament maxTeams not exceeded
- [ ] Verify user is tower owner/co-leader
- [ ] Team name unique in tournament

### **Team Creation:**
- [ ] Team name unique within tower
- [ ] Logo file uploaded (required)
- [ ] Captain is team member
- [ ] At least 1 member selected

### **Tower Creation:**
- [ ] Generate unique join code (8 characters)
- [ ] Set creator as owner
- [ ] Initialize empty teams array

---

## 🎨 Key Features

✅ **Tournament Management**
- Create, view, update tournaments
- Filter by status (upcoming/ongoing/completed)
- Image uploads (banner/logo)
- Team registration approval

✅ **Tower System**
- Create towers with unique codes
- Add co-leaders for management
- Join towers using code
- Manage multiple teams

✅ **Team Management**
- Create teams with logos
- Add/remove members
- Assign captain
- Register to tournaments

✅ **User Profiles**
- View user details
- See towers & teams
- Role-based badges
- Stats display

---

## 🔧 Troubleshooting

### **API Connection Issues:**
```bash
# Check .env.local file exists
# Verify NEXT_PUBLIC_API_URL is correct
# Ensure backend is running
```

### **Image Upload Not Working:**
```bash
# Backend must support multipart/form-data
# Check file size limits
# Verify upload directory permissions
```

### **Navigation Not Working:**
```bash
# Clear browser cache
# Restart dev server
npm run dev
```

---

## 📞 Next Steps

1. **Setup MySQL Database** (see TOURNAMENT_SYSTEM.md)
2. **Implement Backend APIs**
3. **Test All Flows**
4. **Deploy to Production**

---

**Happy Coding! 🎮**

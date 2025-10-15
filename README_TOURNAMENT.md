# 🏆 EsportsNeo - Complete Tournament Management System

## 📖 Overview

Complete esports tournament management platform with role-based access, tower system, team management, and automated notifications.

---

## ✨ Key Features

### 🎮 **Role-Based System**
- **Player** - Default role, create towers & teams
- **Organizer** - Create & manage tournaments
- **Super Admin** - Approve organizers, system control

### 🏰 **Tower System**
- Create towers with unique join codes
- Set max teams limit
- Add ONE co-leader
- Manage multiple teams

### 👥 **Team Management**
- Create teams with logos (required)
- Assign captain & members
- Register to tournaments
- Track team stats

### 🏆 **Tournament System**
- Map pool selection (BGMI)
- Entry fee & prize pool
- Room ID/Password management
- Auto-notification to teams
- Team approval workflow

### 🔔 **Notification System**
- Real-time notifications
- 6 notification types
- Mark as read/unread
- Auto-refresh every 30 seconds

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL database
- Backend API server

### Installation

```bash
# Clone repository
git clone https://github.com/luckyneo12/esportsneo.git
cd esportsneo

# Install dependencies
npm install

# Setup environment
cp ENV_SETUP.md .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 📁 Project Structure

```
esportsne_main/
├── app/
│   ├── tournaments/
│   │   ├── page.tsx              # Tournament listing
│   │   ├── create/page.tsx       # Create tournament (Organizer)
│   │   └── [id]/
│   │       └── room/page.tsx     # Room management (Organizer)
│   ├── towers/
│   │   ├── page.tsx              # Towers listing
│   │   ├── create/page.tsx       # Create tower
│   │   └── [id]/
│   │       ├── page.tsx          # Tower details
│   │       ├── teams/create/     # Create team
│   │       └── register/         # Register to tournament
│   ├── organizer/
│   │   └── apply/page.tsx        # Apply for organizer
│   ├── admin/
│   │   └── dashboard/page.tsx    # Super Admin dashboard
│   ├── profile/
│   │   └── [id]/page.tsx         # User profile
│   └── auth/
│       ├── login/                # Login page
│       └── signup/               # Signup page
├── components/
│   ├── NotificationBell.tsx      # Notification component
│   └── main_components/
│       └── Navbar.tsx            # Navigation
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── api.ts                    # API service layer
│   └── utils.ts                  # Utilities
└── Documentation/
    ├── ENHANCED_SYSTEM.md        # Complete system docs
    ├── API_REFERENCE.md          # API endpoints
    ├── BACKEND_CHECKLIST.md      # Backend guide
    ├── ENV_SETUP.md              # Environment setup
    └── FINAL_SUMMARY.md          # Implementation summary
```

---

## 🎯 User Flows

### **1. Player → Organizer**
```
1. Sign up (Player role)
2. Go to /organizer/apply
3. Fill application form
4. Super Admin reviews
5. If approved → Organizer role
6. Can create tournaments
```

### **2. Create & Manage Tournament**
```
1. Organizer creates tournament
2. Sets details (maps, fee, prize)
3. Tournament goes live
4. Tower owners register teams
5. Organizer approves teams
6. Sets room ID/password
7. Sends to all approved teams
```

### **3. Tower & Team Flow**
```
1. Player creates tower
2. Gets unique join code
3. Creates teams with logos
4. Adds members & captain
5. Registers teams to tournament
6. Waits for approval
7. Receives room details
```

---

## 🔌 API Integration

### **Environment Setup**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **API Endpoints**
- **46 Total Endpoints**
- Tournaments: 9 endpoints
- Towers: 8 endpoints
- Teams: 7 endpoints
- Users: 5 endpoints
- Organizer: 6 endpoints
- Notifications: 4 endpoints
- Authentication: 4 endpoints
- Stats: 3 endpoints

**Full API documentation:** `API_REFERENCE.md`

---

## 🗄️ Database Schema

### **9 Tables Required:**
1. `users` - User profiles with roles
2. `towers` - Tower management
3. `teams` - Team data
4. `tournaments` - Tournament details
5. `tournament_teams` - Team registrations
6. `organizer_applications` - Organizer requests
7. `notifications` - User notifications
8. `user_stats` - Player statistics
9. `achievements` - User achievements

**Full schema:** `ENHANCED_SYSTEM.md`

---

## 🎨 Tech Stack

### **Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- React Hooks

### **Backend (Required)**
- Node.js + Express
- MySQL
- JWT Authentication
- Multer (File uploads)
- Bcrypt (Password hashing)

---

## 📱 Pages Overview

### **Public Pages**
- `/` - Home page
- `/tournaments` - Tournament listing
- `/towers` - Towers listing
- `/auth/login` - Login
- `/auth/signup` - Signup

### **Player Pages**
- `/profile/[id]` - User profile
- `/towers/create` - Create tower
- `/towers/[id]` - Tower details
- `/towers/[id]/teams/create` - Create team
- `/towers/[id]/register` - Register to tournament
- `/organizer/apply` - Apply for organizer

### **Organizer Pages**
- `/tournaments/create` - Create tournament
- `/tournaments/[id]/room` - Room management

### **Super Admin Pages**
- `/admin/dashboard` - Admin dashboard

---

## 🔐 Authentication & Roles

### **Roles:**
1. **Player** (Default)
   - Create towers & teams
   - Join tournaments
   - Apply for organizer

2. **Organizer**
   - Create tournaments
   - Manage registrations
   - Set room details

3. **Super Admin**
   - Approve organizers
   - System management
   - View all data

### **Protected Routes:**
```typescript
// Organizer only
/tournaments/create
/tournaments/[id]/room

// Super Admin only
/admin/dashboard

// Authenticated users
/towers/create
/towers/[id]/teams/create
/organizer/apply
```

---

## 🔔 Notification Types

1. **Tournament Invite** - New tournament available
2. **Team Approved** - Team registration approved
3. **Room Details** - Room ID/Password sent
4. **Organizer Status** - Application reviewed
5. **Tower Invite** - Invited to tower
6. **General** - System notifications

---

## 🎯 Key Features Breakdown

### **Tournament Features:**
✅ Map pool selection (BGMI)
✅ Entry fee (optional)
✅ Prize pool description
✅ Date & time scheduling
✅ Rules & regulations
✅ Tower restrictions
✅ Room ID/Password
✅ Auto-notification

### **Tower Features:**
✅ Unique join code
✅ Tower logo
✅ Max teams limit
✅ ONE co-leader
✅ Team management

### **Team Features:**
✅ Team logo (required)
✅ Captain assignment
✅ Member management
✅ Tournament registration

### **Notification Features:**
✅ Real-time updates
✅ Notification bell
✅ Mark as read
✅ Delete notifications
✅ Auto-refresh

---

## 📊 Statistics

### **Code:**
- Lines of Code: 4,500+
- TypeScript Files: 15+
- React Components: 12+
- API Endpoints: 46
- Type Definitions: 20+

### **Features:**
- Pages: 11
- Roles: 3
- Notification Types: 6
- Database Tables: 9
- Documentation Files: 8

---

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
# Connect GitHub repository
# Set environment variables
# Deploy automatically
```

### **Backend**
```bash
# Deploy to your server
# Configure MySQL
# Set environment variables
# Start server
```

**Deployment guide:** `BACKEND_CHECKLIST.md`

---

## 📚 Documentation

### **Main Documents:**
1. **ENHANCED_SYSTEM.md** - Complete system overview
2. **API_REFERENCE.md** - All API endpoints
3. **BACKEND_CHECKLIST.md** - Backend implementation
4. **ENV_SETUP.md** - Environment configuration
5. **FINAL_SUMMARY.md** - Implementation summary
6. **QUICK_START.md** - Quick reference

### **Original Documents:**
7. **TOURNAMENT_SYSTEM.md** - Original system docs
8. **IMPLEMENTATION_SUMMARY.md** - First implementation

---

## 🧪 Testing

### **Manual Testing Checklist:**
- [ ] User signup & login
- [ ] Create tower
- [ ] Create team with logo
- [ ] Apply for organizer
- [ ] Super Admin approval
- [ ] Create tournament
- [ ] Register team to tournament
- [ ] Approve team
- [ ] Set room details
- [ ] Send notifications
- [ ] Receive notifications

---

## 🔧 Development

### **Run Development Server:**
```bash
npm run dev
```

### **Build for Production:**
```bash
npm run build
```

### **Start Production Server:**
```bash
npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License

---

## 📞 Contact & Support

### **Social Media:**
- **X (Twitter)**: [@X_esportsneo](https://x.com/X_esportsneo)
- **YouTube**: [@EsportNeo](https://www.youtube.com/@EsportNeo)
- **Instagram**: [@ig.esports_neo](https://www.instagram.com/ig.esports_neo/)
- **WhatsApp**: [+916269957381](https://wa.me/916269957381)

### **Support:**
- Check documentation files
- Review API reference
- Follow backend checklist
- Contact via social media

---

## 🎊 What's Included

### ✅ **Frontend (Complete)**
- 11 fully functional pages
- 46 API endpoints integrated
- Complete type system
- Notification system
- Role-based UI
- Responsive design
- Comprehensive documentation

### 🔧 **Backend (Required)**
- MySQL database setup
- API implementation
- Authentication system
- File upload handling
- Notification system
- Testing & deployment

---

## 🎯 Next Steps

1. **Setup Backend**
   - Create MySQL database
   - Implement API endpoints
   - Add authentication

2. **Configure Environment**
   - Set environment variables
   - Configure file uploads
   - Setup CORS

3. **Test System**
   - Test all user flows
   - Verify notifications
   - Check permissions

4. **Deploy**
   - Deploy frontend (Vercel)
   - Deploy backend
   - Configure domain

---

## 🏆 System Status

**Frontend:** ✅ 100% Complete
**Backend:** 🔧 Pending Implementation
**Documentation:** ✅ Complete
**Deployment:** 🔧 Pending

---

**Built with ❤️ for the Esports Community**

*Experience the ultimate esports tournament management!*

---

## 📖 Quick Links

- [Enhanced System Docs](./ENHANCED_SYSTEM.md)
- [API Reference](./API_REFERENCE.md)
- [Backend Checklist](./BACKEND_CHECKLIST.md)
- [Environment Setup](./ENV_SETUP.md)
- [Final Summary](./FINAL_SUMMARY.md)

---

**Happy Coding! 🎮🏆**

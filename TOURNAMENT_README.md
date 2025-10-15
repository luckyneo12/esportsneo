# 🏆 EsportsNeo - Tournament Management System

## 🎮 Overview

Complete esports tournament management platform with towers, teams, and tournament registration system.

## ✨ Features

### 🏆 **Tournament System**
- Create and manage tournaments
- Multiple game support (BGMI, Free Fire, Valorant, COD)
- Team registration with approval workflow
- Status tracking (upcoming, ongoing, completed)
- Banner and logo uploads
- Max teams limit enforcement

### 🏰 **Tower System**
- Create towers to organize teams
- Unique join codes for players
- Owner and co-leader roles
- Manage multiple teams per tower
- Register teams to tournaments

### 👥 **Team Management**
- Create teams with custom logos
- Assign team captain
- Add/remove members
- Unique team names per tower
- Team roster management

### 👤 **User Profiles**
- Role-based system (Player, Tower Owner, Organiser, Admin)
- Profile with avatar and bio
- View towers and teams
- Activity statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- Backend API server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/luckyneo12/esportsneo.git
   cd esportsneo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
esportsne_main/
├── app/
│   ├── tournaments/           # Tournament pages
│   │   ├── page.tsx          # Tournaments listing
│   │   └── create/page.tsx   # Create tournament
│   ├── towers/               # Tower pages
│   │   ├── page.tsx          # Towers listing
│   │   ├── create/page.tsx   # Create tower
│   │   └── [id]/
│   │       ├── page.tsx      # Tower details
│   │       ├── teams/create/ # Create team
│   │       └── register/     # Register to tournament
│   ├── profile/              # User profiles
│   │   └── [id]/page.tsx
│   └── auth/                 # Authentication
│       ├── login/
│       └── signup/
├── components/
│   ├── main_components/      # Main UI components
│   └── ui/                   # Reusable components
├── lib/
│   ├── api.ts               # API service layer
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utilities
└── public/                  # Static assets
```

## 🎯 User Flows

### **Admin/Organiser:**
1. Login to dashboard
2. Create tournament with details
3. Upload banner/logo
4. Set max teams limit
5. Approve/reject team registrations

### **Tower Owner:**
1. Create tower (get unique code)
2. Add co-leaders (optional)
3. Create teams with logos
4. Add team members
5. Register teams to tournaments
6. Wait for admin approval

### **Player:**
1. Join tower using code
2. Get added to teams
3. Participate in tournaments

## 🔌 API Integration

### **Base URL Configuration**
```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **API Endpoints Required**

#### Tournaments
```
GET    /api/tournaments              # List all tournaments
GET    /api/tournaments/:id          # Get tournament details
POST   /api/tournaments              # Create tournament
PUT    /api/tournaments/:id          # Update tournament
DELETE /api/tournaments/:id          # Delete tournament
GET    /api/tournaments/:id/teams    # Get registered teams
PATCH  /api/tournaments/:id/teams/:teamId  # Approve/reject team
```

#### Towers
```
GET    /api/towers                   # List all towers
GET    /api/towers/:id               # Get tower details
POST   /api/towers                   # Create tower
POST   /api/towers/join              # Join with code
POST   /api/towers/:id/register-teams  # Register teams
POST   /api/towers/:id/co-leaders    # Add co-leader
```

#### Teams
```
GET    /api/teams                    # List teams
GET    /api/teams/:id                # Get team details
POST   /api/teams                    # Create team
PUT    /api/teams/:id                # Update team
POST   /api/teams/:id/members        # Add member
```

#### Users
```
GET    /api/users/:id                # Get user profile
PUT    /api/users/:id                # Update profile
GET    /api/users/search?q=query     # Search users
```

## 🗄️ Database Schema

### **MySQL Tables**

#### users
```sql
id, name, username, mobile, avatar, bio, role, created_at
```

#### towers
```sql
id, name, code, owner_id, co_leaders (JSON), created_at
```

#### teams
```sql
id, name, logo, tower_id, captain_id, members (JSON), created_at
UNIQUE (name, tower_id)
```

#### tournaments
```sql
id, title, game, description, banner, logo, status, max_teams, created_by, created_at
```

#### tournament_teams
```sql
id, tournament_id, team_id, registered_by, status, registered_at
UNIQUE (tournament_id, team_id)
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Hooks
- **API**: Fetch API with custom service layer
- **Database**: MySQL (backend)

## 🔒 Security

### **Frontend:**
- Type-safe API calls
- Client-side validation
- Secure file uploads

### **Backend Required:**
- JWT authentication
- Role-based authorization
- SQL injection prevention
- File upload validation
- Rate limiting

## 📝 Validation Rules

### **Tournament Registration:**
✅ No duplicate teams per tournament
✅ Max teams limit enforcement
✅ Only tower owner/co-leader can register
✅ Team name uniqueness in tournament

### **Team Creation:**
✅ Unique name within tower
✅ Logo required
✅ Captain must be team member
✅ At least 1 member required

## 🎨 Design System

### **Colors**
- Background: `#0D0D0D`
- Primary Red: `#FF1A1A`
- Secondary Red: `#FF4D4D`
- Card Background: `#1A1A1A`
- Text: `#FFFFFF`
- Gray: `#B3B3B3`

### **Components**
- Responsive cards with hover effects
- Status badges
- Image upload with preview
- Modal dialogs
- Loading states
- Error/success messages

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly UI
- Optimized for all devices

## 🧪 Testing

### **Manual Testing Checklist:**
- [ ] Create tournament
- [ ] Create tower
- [ ] Create team
- [ ] Register team to tournament
- [ ] Join tower with code
- [ ] Upload images
- [ ] Search users
- [ ] View profiles

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
# Set up file uploads
# Enable CORS
```

## 📚 Documentation

- **TOURNAMENT_SYSTEM.md** - Complete system documentation
- **QUICK_START.md** - Quick reference guide
- **IMPLEMENTATION_SUMMARY.md** - Implementation details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

## 📞 Contact

- **X (Twitter)**: [@X_esportsneo](https://x.com/X_esportsneo)
- **YouTube**: [@EsportNeo](https://www.youtube.com/@EsportNeo)
- **Instagram**: [@ig.esports_neo](https://www.instagram.com/ig.esports_neo/)
- **WhatsApp**: [+916269957381](https://wa.me/916269957381)

---

**Built with ❤️ for the Esports Community**

*Experience the ultimate esports tournament management!*

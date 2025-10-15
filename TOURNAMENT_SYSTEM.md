# 🏆 Tournament Management System Documentation

## Overview
Ye ek complete tournament management system hai jo towers, teams, aur tournaments ko manage karta hai. System MySQL backend se connect hota hai.

## 🎯 Core Concepts

### 1. **User (यूजर)**
Har user ka apna profile hota hai with following details:
- **id**: Unique identifier
- **name**: User ka naam
- **username**: Unique username
- **mobile**: Phone number (login ke liye required)
- **avatar**: Profile picture (optional, default avatar if not uploaded)
- **bio**: User bio (optional)
- **role**: `player`, `towerOwner`, `organiser`, ya `admin`

**Pages:**
- `/profile/[id]` - User profile page

---

### 2. **Tower (टावर)**
Tower ek group hai jisme teams exist karti hain. Tower owner apni teams ko tournaments me register kar sakta hai.

**Features:**
- Unique join code (players join karne ke liye)
- Owner + Co-leaders (management ke liye)
- Multiple teams (tower ke andar)

**Pages:**
- `/towers` - All towers listing
- `/towers/create` - New tower create karna
- `/towers/[id]` - Tower detail page with teams
- `/towers/[id]/teams/create` - New team create karna
- `/towers/[id]/register` - Teams ko tournament me register karna

**API Endpoints (Backend):**
```
GET    /api/towers              - Get all towers
GET    /api/towers/:id          - Get tower by ID
POST   /api/towers              - Create new tower
PUT    /api/towers/:id          - Update tower
DELETE /api/towers/:id          - Delete tower
POST   /api/towers/:id/co-leaders - Add co-leader
DELETE /api/towers/:id/co-leaders/:userId - Remove co-leader
POST   /api/towers/join         - Join tower with code
POST   /api/towers/:id/register-teams - Register teams to tournament
```

---

### 3. **Team (टीम)**
Team tower ke andar banti hai. Har team ka unique naam aur logo hona chahiye.

**Features:**
- Unique name (within tower)
- Logo (required)
- Captain (team ka leader)
- Members (team ke players)

**Validation:**
- Team name unique hona chahiye tower ke andar
- Logo required hai
- Captain team ka member hona chahiye

**Pages:**
- `/teams/[id]` - Team detail page (create karna hai)

**API Endpoints (Backend):**
```
GET    /api/teams               - Get all teams
GET    /api/teams?towerId=:id   - Get teams by tower
GET    /api/teams/:id           - Get team by ID
POST   /api/teams               - Create new team (with logo upload)
PUT    /api/teams/:id           - Update team
DELETE /api/teams/:id           - Delete team
POST   /api/teams/:id/members   - Add member
DELETE /api/teams/:id/members/:userId - Remove member
```

---

### 4. **Tournament (टूर्नामेंट)**
Admin/Organiser tournaments create karte hain. Tower owners apni teams ko register karte hain.

**Features:**
- Title, Game, Description
- Banner & Logo (optional)
- Status: `upcoming`, `ongoing`, `completed`
- Max Teams limit
- Registered teams list

**Pages:**
- `/tournaments` - All tournaments listing
- `/tournaments/create` - Create tournament (admin/organiser only)
- `/tournaments/[id]` - Tournament detail page (create karna hai)

**API Endpoints (Backend):**
```
GET    /api/tournaments         - Get all tournaments (with filters)
GET    /api/tournaments/:id     - Get tournament by ID
POST   /api/tournaments         - Create tournament (with image upload)
PUT    /api/tournaments/:id     - Update tournament
DELETE /api/tournaments/:id     - Delete tournament
GET    /api/tournaments/:id/teams - Get registered teams
PATCH  /api/tournaments/:id/teams/:teamId - Approve/Reject team
```

---

## 🔄 Complete Flow

### **1. User Signup → Profile Creation**
```
User signs up → Profile banta hai → Role assign hota hai
```

### **2. Tower Creation**
```
User → Create Tower → Tower banta hai with unique code
                    → User becomes owner
```

### **3. Team Creation**
```
Tower Owner → Create Team → Team name (unique in tower)
                          → Upload logo (required)
                          → Select captain & members
                          → Team tower me add hoti hai
```

### **4. Tournament Creation (Admin/Organiser)**
```
Admin → Create Tournament → Title, Game, Description
                          → Upload Banner/Logo
                          → Set maxTeams
                          → Status (upcoming/ongoing/completed)
```

### **5. Team Registration to Tournament**
```
Tower Owner → Select Tournament → Select Teams from tower
                                → System validates:
                                  ✓ Team already registered? (duplicate check)
                                  ✓ Tournament full? (maxTeams check)
                                  ✓ Team name unique in tournament?
                                → Submit for approval
                                → Admin approves/rejects
```

---

## 🛠️ Backend Requirements

### **Database Schema (MySQL)**

#### **users table**
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  role ENUM('player', 'towerOwner', 'organiser', 'admin') DEFAULT 'player',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **towers table**
```sql
CREATE TABLE towers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(8) UNIQUE NOT NULL,
  owner_id VARCHAR(36) NOT NULL,
  co_leaders JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

#### **teams table**
```sql
CREATE TABLE teams (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  tower_id VARCHAR(36) NOT NULL,
  captain_id VARCHAR(36) NOT NULL,
  members JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tower_id) REFERENCES towers(id),
  FOREIGN KEY (captain_id) REFERENCES users(id),
  UNIQUE KEY unique_team_name_per_tower (name, tower_id)
);
```

#### **tournaments table**
```sql
CREATE TABLE tournaments (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  game ENUM('BGMI', 'FF', 'VALORANT', 'COD', 'OTHER') NOT NULL,
  description TEXT NOT NULL,
  banner VARCHAR(255),
  logo VARCHAR(255),
  status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
  max_teams INT NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### **tournament_teams table**
```sql
CREATE TABLE tournament_teams (
  id VARCHAR(36) PRIMARY KEY,
  tournament_id VARCHAR(36) NOT NULL,
  team_id VARCHAR(36) NOT NULL,
  registered_by VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (registered_by) REFERENCES users(id),
  UNIQUE KEY unique_team_per_tournament (tournament_id, team_id)
);
```

---

## 🔐 Authentication & Authorization

### **Required Middleware:**
- JWT authentication for protected routes
- Role-based access control:
  - **Admin/Organiser**: Tournament create/update/delete
  - **Tower Owner/Co-leader**: Team registration, tower management
  - **Player**: Join towers, view tournaments

### **Protected Routes:**
```javascript
// Admin/Organiser only
POST   /api/tournaments
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
PATCH  /api/tournaments/:id/teams/:teamId

// Tower Owner/Co-leader only
POST   /api/teams
PUT    /api/teams/:id
DELETE /api/teams/:id
POST   /api/towers/:id/register-teams
```

---

## 📝 Validation Rules

### **Tournament Registration:**
1. ✅ Team already registered? → **Block duplicate**
2. ✅ Team name unique in tournament? → **Check uniqueness**
3. ✅ Tournament maxTeams exceeded? → **Block if full**
4. ✅ User is tower owner/co-leader? → **Check permission**

### **Team Creation:**
1. ✅ Team name unique in tower? → **Check uniqueness**
2. ✅ Logo uploaded? → **Required field**
3. ✅ Captain is team member? → **Validate captain**

---

## 🎨 Frontend Setup

### **Environment Variables:**
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **API Service Layer:**
Location: `/lib/api.ts`
- All API calls centralized
- Error handling included
- FormData support for file uploads

### **TypeScript Types:**
Location: `/lib/types.ts`
- Complete type definitions
- Type safety throughout app

---

## 🚀 Getting Started

### **1. Install Dependencies:**
```bash
npm install
```

### **2. Set Environment Variables:**
```bash
# Copy env.example.txt to .env.local
# Update NEXT_PUBLIC_API_URL with your backend URL
```

### **3. Run Development Server:**
```bash
npm run dev
```

### **4. Access Pages:**
- Tournaments: http://localhost:3000/tournaments
- Towers: http://localhost:3000/towers
- Profile: http://localhost:3000/profile/[userId]

---

## 📱 Key Features

### ✅ **Implemented:**
- Tournament listing & creation
- Tower creation & management
- Team creation with logo upload
- Tournament registration flow
- User profile page
- Search & filter functionality
- Responsive design
- Real-time validation

### 🔜 **Backend Required:**
- MySQL database setup
- API endpoints implementation
- File upload handling (images)
- Authentication & authorization
- Validation logic

---

## 🎯 Next Steps

1. **Backend Setup:**
   - Create MySQL database
   - Implement API endpoints
   - Add authentication
   - File upload configuration

2. **Testing:**
   - Test all flows
   - Validate edge cases
   - Check permissions

3. **Deployment:**
   - Deploy frontend (Vercel)
   - Deploy backend
   - Configure environment variables

---

## 📞 Support

For any issues or questions, refer to the API documentation or contact the development team.

**Built with ❤️ for EsportsNeo**

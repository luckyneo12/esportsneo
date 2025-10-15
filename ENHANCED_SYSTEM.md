# 🎮 Enhanced Tournament System - Complete Documentation

## 🔑 Role System

### **1. Player (Default Role)**
**Capabilities:**
- ✅ Create profile with game ID
- ✅ Create tower (becomes Tower Owner)
- ✅ Join teams
- ✅ Apply for Organizer role
- ✅ View tournaments
- ✅ Receive notifications

**Profile Fields:**
- Name, Username, Email, Mobile
- Profile Picture/Avatar
- Game ID (in-game ID)
- Bio
- Stats (matches, wins, kills, etc.)
- Achievements

---

### **2. Tower Owner**
**Capabilities:**
- ✅ All Player capabilities
- ✅ Create and manage tower
- ✅ Set max teams limit for tower
- ✅ Assign ONE co-leader
- ✅ Create teams within tower
- ✅ Invite/approve teams
- ✅ Register teams to tournaments
- ✅ Manage team members

**Tower Features:**
- Unique tower name
- Tower logo (optional)
- Unique join code (8 characters)
- Max teams limit (1-50)
- ONE co-leader allowed

---

### **3. Organizer**
**Capabilities:**
- ✅ All Player capabilities
- ✅ Create tournaments
- ✅ Set room ID and password
- ✅ Approve/reject team registrations
- ✅ Confirm team slots
- ✅ Send room details to approved teams
- ✅ Manage tournament settings

**How to Become Organizer:**
1. Player applies via `/organizer/apply`
2. Fills application form with:
   - Reason for applying
   - Previous experience
   - Social links (YouTube, Instagram, Discord)
3. Super Admin reviews application
4. If approved → User role changes to Organizer

---

### **4. Super Admin**
**Capabilities:**
- ✅ View all organizer applications
- ✅ Approve/reject organizer applications
- ✅ View all organizers
- ✅ Block/unblock organizers
- ✅ Access admin dashboard
- ✅ View global system data
- ✅ Generate reports

**Admin Dashboard:** `/admin/dashboard`
- Pending applications
- Approved applications
- Rejected applications
- All organizers list

---

## 🏗️ System Workflow

### **1. User Registration**
```
User signs up → Default role = Player
Profile creation:
  - Name, Username, Email, Mobile
  - Profile Picture (optional)
  - Game ID
  - Bio (optional)
```

---

### **2. Tower Management**

#### **Creating Tower:**
```
Player → Create Tower → Becomes Tower Owner
Fields:
  - Tower Name (unique)
  - Tower Logo (optional)
  - Max Teams (1-50)
  - Auto-generated join code
```

#### **Tower Features:**
- **Join Code:** 8-character unique code for players to join
- **Co-Leader:** Owner can assign ONE co-leader
- **Teams:** Limited by maxTeams setting
- **Permissions:** Owner + Co-leader can manage teams

---

### **3. Team Management**

#### **Creating Team:**
```
Tower Owner/Co-Leader → Create Team
Requirements:
  - Unique team name (within tower)
  - Team logo (REQUIRED)
  - Select captain
  - Add members
```

#### **Team Hierarchy:**
```
Tower Owner
    ↓
Co-Leader (optional, only 1)
    ↓
Team Captain
    ↓
Team Members
```

---

### **4. Organizer Application**

#### **Application Process:**
```
1. Player → Apply for Organizer (/organizer/apply)
2. Fill form:
   - Why you want to be organizer
   - Previous experience
   - Social media links
3. Submit application
4. Super Admin reviews
5. Approved/Rejected
6. If approved → Role changes to Organizer
```

#### **Application Form Fields:**
- Reason (required)
- Experience (optional)
- YouTube channel (optional)
- Instagram profile (optional)
- Discord server (optional)

---

### **5. Tournament System**

#### **Creating Tournament (Organizer Only):**
```
Organizer → Create Tournament
Fields:
  - Title
  - Game (BGMI, FF, Valorant, COD, Other)
  - Map Pool (for BGMI: Erangel, Miramar, etc.)
  - Date & Time
  - Max Teams
  - Entry Fee (optional)
  - Prize Pool (optional)
  - Description
  - Rules & Regulations
  - Banner & Logo (optional)
  - Allowed Towers (optional - restrict to specific towers)
```

#### **Tournament Features:**
- **Status:** Upcoming, Ongoing, Completed
- **Map Pool:** Select multiple maps for BGMI
- **Entry Fee:** Set fee or make it free
- **Prize Pool:** Describe prize distribution
- **Tower Restriction:** Allow specific towers only (or all)

---

### **6. Team Registration to Tournament**

#### **Registration Flow:**
```
1. Tournament created → Notification sent to Tower Owners
2. Tower Owner → Select tournament
3. Select teams from tower
4. Submit registration
5. Organizer reviews
6. Approve/Reject teams
7. Approved teams get slot number
```

#### **Validation Checks:**
- ✅ Team not already registered
- ✅ Tournament not full (maxTeams)
- ✅ Team name unique in tournament
- ✅ User is tower owner/co-leader
- ✅ Tower allowed (if restrictions set)

---

### **7. Room ID/Password Distribution**

#### **Room Management Flow:**
```
1. Organizer → Tournament Room Page (/tournaments/[id]/room)
2. Set Room ID and Password
3. Click "Send to Teams"
4. System automatically sends notification to ALL approved teams
```

#### **Notification Format:**
```
Title: "Room Details - [Tournament Name]"
Message: "Your team [TEAM NAME] has been confirmed for [TOURNAMENT NAME]. 
         Room ID: xxxx, Password: yyyy"
Type: room_details
```

#### **Features:**
- ✅ Update room details anytime
- ✅ Send to all approved teams with one click
- ✅ Track notification sent status
- ✅ View approved teams count

---

## 📬 Notification System

### **Notification Types:**

#### **1. Tournament Invite**
```
When: Tournament created
To: All tower owners (or specific towers)
Message: "New tournament [NAME] is open for registration!"
```

#### **2. Team Approved**
```
When: Organizer approves team
To: Tower owner + team members
Message: "Your team [TEAM NAME] has been approved for [TOURNAMENT]!"
```

#### **3. Room Details**
```
When: Organizer sends room details
To: All approved team members
Message: "Room ID: xxxx, Password: yyyy for [TOURNAMENT]"
```

#### **4. Organizer Status**
```
When: Super Admin reviews application
To: Applicant
Message: "Your organizer application has been [APPROVED/REJECTED]"
```

#### **5. Tower Invite**
```
When: Added to tower
To: User
Message: "You've been invited to join [TOWER NAME]"
```

---

## 📊 User Stats & Achievements

### **Stats Tracked:**
- Matches Played
- Wins
- Kills
- Deaths
- Assists
- Tournaments Participated
- Tournaments Won

### **Achievements:**
- First Tournament Win
- 100 Kills Milestone
- Team Captain
- Tower Owner
- Organizer Status
- Custom achievements

---

## 🎯 API Endpoints Summary

### **Organizer APIs:**
```
POST   /api/organizer/apply                      # Apply for organizer
GET    /api/organizer/my-application             # Check application status
GET    /api/organizer/applications               # Get all (Super Admin)
PATCH  /api/organizer/applications/:id/review    # Review (Super Admin)
GET    /api/organizer/list                       # All organizers (Super Admin)
PATCH  /api/organizer/:id/toggle-status          # Block/unblock (Super Admin)
```

### **Notification APIs:**
```
GET    /api/notifications                        # Get user notifications
PATCH  /api/notifications/:id/read               # Mark as read
PATCH  /api/notifications/read-all               # Mark all as read
DELETE /api/notifications/:id                    # Delete notification
```

### **Tournament Room APIs:**
```
PATCH  /api/tournaments/:id/room                 # Update room details
POST   /api/tournaments/:id/send-room-details    # Send to teams
```

### **User Stats APIs:**
```
GET    /api/users/:id/stats                      # Get user stats
GET    /api/users/:id/achievements               # Get achievements
```

---

## 🗄️ Enhanced Database Schema

### **users table:**
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  game_id VARCHAR(100),
  role ENUM('player', 'organizer', 'superAdmin') DEFAULT 'player',
  is_organizer_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **towers table:**
```sql
CREATE TABLE towers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  logo VARCHAR(255),
  code VARCHAR(8) UNIQUE NOT NULL,
  owner_id VARCHAR(36) NOT NULL,
  co_leader_id VARCHAR(36),
  max_teams INT NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (co_leader_id) REFERENCES users(id)
);
```

### **tournaments table:**
```sql
CREATE TABLE tournaments (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  game ENUM('BGMI', 'FF', 'VALORANT', 'COD', 'OTHER') NOT NULL,
  map_pool JSON,
  description TEXT NOT NULL,
  rules TEXT,
  banner VARCHAR(255),
  logo VARCHAR(255),
  status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
  max_teams INT NOT NULL,
  entry_fee DECIMAL(10, 2) DEFAULT 0,
  prize_pool TEXT,
  date_time DATETIME NOT NULL,
  allowed_tower_ids JSON,
  room_id VARCHAR(50),
  room_password VARCHAR(50),
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### **tournament_teams table:**
```sql
CREATE TABLE tournament_teams (
  id VARCHAR(36) PRIMARY KEY,
  tournament_id VARCHAR(36) NOT NULL,
  team_id VARCHAR(36) NOT NULL,
  registered_by VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  slot_number INT,
  notification_sent BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (registered_by) REFERENCES users(id),
  UNIQUE KEY unique_team_per_tournament (tournament_id, team_id)
);
```

### **organizer_applications table:**
```sql
CREATE TABLE organizer_applications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  reason TEXT NOT NULL,
  experience TEXT,
  social_links JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by VARCHAR(36),
  review_notes TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
```

### **notifications table:**
```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('tournament_invite', 'team_approved', 'room_details', 'organizer_status', 'tower_invite', 'general'),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_unread (user_id, is_read)
);
```

### **user_stats table:**
```sql
CREATE TABLE user_stats (
  user_id VARCHAR(36) PRIMARY KEY,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  kills INT DEFAULT 0,
  deaths INT DEFAULT 0,
  assists INT DEFAULT 0,
  tournaments_participated INT DEFAULT 0,
  tournaments_won INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **achievements table:**
```sql
CREATE TABLE achievements (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 📱 Frontend Pages Summary

### **Created Pages:**
1. `/organizer/apply` - Organizer application form
2. `/admin/dashboard` - Super Admin dashboard
3. `/tournaments/create` - Enhanced tournament creation
4. `/tournaments/[id]/room` - Room management (Organizer)
5. `/towers/create` - Enhanced tower creation with logo & maxTeams

### **Components:**
1. `NotificationBell.tsx` - Real-time notification component

---

## 🎯 Key Features Implemented

### ✅ **Role-Based System:**
- Player, Organizer, Super Admin roles
- Organizer application & approval workflow
- Permission-based access control

### ✅ **Enhanced Tournament:**
- Map pool selection (BGMI)
- Entry fee & prize pool
- Date & time scheduling
- Rules & regulations
- Tower restrictions
- Room ID/Password management
- Auto-notification to teams

### ✅ **Enhanced Tower:**
- Tower logo upload
- Max teams limit
- ONE co-leader system
- Join code system

### ✅ **Notification System:**
- Real-time notifications
- Multiple notification types
- Mark as read/unread
- Delete notifications
- Notification bell component

### ✅ **User Stats & Achievements:**
- Track player performance
- Achievement system
- Profile enhancements

---

## 🚀 Deployment Checklist

### **Backend:**
- [ ] Create all database tables
- [ ] Implement all API endpoints
- [ ] Set up notification system
- [ ] Configure file uploads
- [ ] Add authentication & authorization
- [ ] Set up cron jobs (if needed)

### **Frontend:**
- [ ] Set environment variables
- [ ] Test all user flows
- [ ] Verify role-based access
- [ ] Test notifications
- [ ] Deploy to Vercel

### **Testing:**
- [ ] Player registration & profile
- [ ] Tower creation & management
- [ ] Team creation & registration
- [ ] Organizer application flow
- [ ] Super Admin approval process
- [ ] Tournament creation & room management
- [ ] Notification delivery
- [ ] Stats tracking

---

**System Complete! Ready for backend implementation and deployment. 🎮🏆**

# 👤 Enhanced User Profile System

## 📋 Complete Profile Features

### **1. Basic Info Section**
```typescript
- Profile Photo (avatar/logo) ✅
- Username (unique) ✅
- Name ✅
- Bio (introduction) ✅
- Mobile (hidden, login only) ✅
- Email ✅
- Game ID (in-game ID) ✅
- Custom Tagline/Motto ✅
- Level & XP (gamification) ✅
```

### **2. Game & Team Info**
```typescript
- Current Tower ✅
- Role in Tower (Owner/Co-Leader/Member) ✅
- Current Team ✅
- Team Name & Logo ✅
- Team Role (Captain/Player/Substitute) ✅
```

### **3. Tournament Info**
```typescript
- Participated Tournaments (history) ✅
- Ongoing Tournaments ✅
- Tournament Wins ✅
- Achievements ✅
- Slot Information ✅
```

### **4. Performance Stats**
```typescript
- Matches Played ✅
- Matches Won ✅
- K/D Ratio ✅
- MVP Count ✅
- Total Points Earned ✅
- Kills, Deaths, Assists ✅
```

### **5. Social Links**
```typescript
- Instagram ✅
- YouTube ✅
- Discord ✅
```

### **6. Settings & Controls**
```typescript
- Password Change ✅
- Notification Preferences ✅
- Apply for Organizer ✅
- Logout ✅
```

### **7. Gamification**
```typescript
- Badges (First Tournament, Tower Owner, MVP) ✅
- Levels (XP system) ✅
- Achievements ✅
- Rarity System (Common, Rare, Epic, Legendary) ✅
```

---

## 🎨 Profile Page Structure

### **Tab System:**
1. **Overview** - Basic info + current team/tower
2. **Stats** - Performance statistics
3. **Tournaments** - History & ongoing
4. **Achievements** - Badges & achievements
5. **Settings** - Account settings

---

## 📊 Enhanced TypeScript Types

### **User Type (Enhanced):**
```typescript
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  avatar?: string;
  bio?: string;
  gameId?: string;
  tagline?: string; // NEW
  role: UserRole;
  socialLinks?: { // NEW
    instagram?: string;
    youtube?: string;
    discord?: string;
  };
  level?: number; // NEW
  xp?: number; // NEW
  createdAt: string;
  updatedAt: string;
}
```

### **UserStats (Enhanced):**
```typescript
export interface UserStats {
  userId: string;
  matchesPlayed: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number; // NEW
  mvpCount: number; // NEW
  totalPoints: number; // NEW
  tournamentsParticipated: number;
  tournamentsWon: number;
  updatedAt: string;
}
```

### **Badge System:**
```typescript
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
}
```

### **Achievement (Enhanced):**
```typescript
export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon?: string;
  category: 'tournament' | 'performance' | 'milestone' | 'special'; // NEW
  earnedAt: string;
}
```

### **UserProfile (Complete):**
```typescript
export interface UserProfile extends User {
  stats?: UserStats;
  achievements?: Achievement[];
  badges?: Badge[];
  currentTower?: Tower;
  currentTeam?: Team;
  towerRole?: 'owner' | 'coLeader' | 'member';
  teamRole?: 'captain' | 'player' | 'substitute';
  ongoingTournaments?: Tournament[];
  tournamentHistory?: Tournament[];
}
```

---

## 🔌 Additional API Endpoints

### **Profile APIs:**
```typescript
// Get complete profile
GET /api/users/:id/profile
Response: UserProfile

// Update profile
PUT /api/users/:id/profile
Body: {
  name?: string,
  bio?: string,
  gameId?: string,
  tagline?: string,
  avatar?: File,
  socialLinks?: {
    instagram?: string,
    youtube?: string,
    discord?: string
  }
}

// Get user stats
GET /api/users/:id/stats
Response: UserStats

// Get achievements
GET /api/users/:id/achievements
Response: Achievement[]

// Get badges
GET /api/users/:id/badges
Response: Badge[]

// Get tournament history
GET /api/users/:id/tournaments
Query: status=completed|ongoing
Response: Tournament[]

// Update notification preferences
PATCH /api/users/:id/preferences
Body: {
  emailNotifications: boolean,
  pushNotifications: boolean,
  tournamentNotifications: boolean,
  towerNotifications: boolean
}

// Change password
POST /api/users/:id/change-password
Body: {
  currentPassword: string,
  newPassword: string
}
```

---

## 🎯 Profile Page Components

### **1. Overview Tab:**
```tsx
<ProfileOverview>
  - Avatar with edit button
  - Name, Username, Tagline
  - Bio
  - Level & XP Progress Bar
  - Role Badge
  - Social Links (Instagram, YouTube, Discord)
  - Current Tower Info
  - Current Team Info
  - Quick Stats (Towers, Teams, Tournaments)
</ProfileOverview>
```

### **2. Stats Tab:**
```tsx
<StatsTab>
  - Performance Overview Card
    - Matches Played
    - Win Rate %
    - K/D Ratio
  - Detailed Stats Grid
    - Kills
    - Deaths
    - Assists
    - MVP Count
    - Total Points
  - Tournament Stats
    - Participated
    - Won
    - Win Rate
  - Charts/Graphs (optional)
</StatsTab>
```

### **3. Tournaments Tab:**
```tsx
<TournamentsTab>
  - Ongoing Tournaments
    - Tournament card
    - Slot info
    - Team info
    - Status
  - Tournament History
    - Past tournaments
    - Result (Won/Lost)
    - Position
    - Points earned
  - Filters (All/Won/Lost)
</TournamentsTab>
```

### **4. Achievements Tab:**
```tsx
<AchievementsTab>
  - Badges Grid
    - Badge icon
    - Name
    - Rarity indicator
    - Earned date
  - Achievements List
    - Category filter
    - Achievement card
    - Progress (if applicable)
  - Locked Achievements (greyed out)
</AchievementsTab>
```

### **5. Settings Tab:**
```tsx
<SettingsTab>
  - Account Settings
    - Change Password
    - Email preferences
  - Notification Settings
    - Tournament notifications
    - Tower notifications
    - Team notifications
  - Privacy Settings
    - Profile visibility
    - Stats visibility
  - Role Management
    - Apply for Organizer button
    - Current role display
  - Danger Zone
    - Logout button
    - Delete account (optional)
</SettingsTab>
```

---

## 🎨 Badge System

### **Badge Categories:**

#### **Tournament Badges:**
- 🏆 **First Tournament** - Participate in first tournament
- 🥇 **Tournament Winner** - Win a tournament
- 🔥 **Tournament Streak** - Win 3 tournaments in a row
- ⭐ **Tournament Legend** - Win 10+ tournaments

#### **Performance Badges:**
- 💯 **100 Kills** - Reach 100 total kills
- 🎯 **Sharpshooter** - K/D ratio > 3.0
- 👑 **MVP Master** - Get 5+ MVP awards
- 🚀 **Point Master** - Earn 10,000+ points

#### **Milestone Badges:**
- 🏰 **Tower Owner** - Create a tower
- 👥 **Team Captain** - Become team captain
- 📢 **Organizer** - Become organizer
- 🎖️ **Veteran** - Play 100+ matches

#### **Special Badges:**
- 💎 **Early Adopter** - Join in first month
- 🌟 **Community Hero** - Help 10+ players
- 🎁 **Event Participant** - Join special events
- 🏅 **Achievement Hunter** - Unlock all achievements

### **Rarity Colors:**
```css
Common: Gray (#9CA3AF)
Rare: Blue (#3B82F6)
Epic: Purple (#A855F7)
Legendary: Gold (#F59E0B)
```

---

## 📈 Level & XP System

### **XP Earning:**
```typescript
- Match Played: +10 XP
- Match Won: +50 XP
- Kill: +5 XP
- MVP Award: +100 XP
- Tournament Participation: +200 XP
- Tournament Win: +500 XP
- Achievement Unlocked: +50-200 XP
```

### **Level Calculation:**
```typescript
Level 1: 0-100 XP
Level 2: 100-250 XP
Level 3: 250-500 XP
Level 4: 500-1000 XP
Level 5: 1000-2000 XP
...
Formula: XP_needed = 100 * (level ^ 1.5)
```

### **Level Benefits:**
```typescript
Level 5: Unlock custom tagline
Level 10: Unlock special badge
Level 15: Priority tournament registration
Level 20: Custom profile theme
Level 25: Legendary badge
```

---

## 🗄️ Database Schema Updates

### **users table (additions):**
```sql
ALTER TABLE users ADD COLUMN tagline VARCHAR(100);
ALTER TABLE users ADD COLUMN social_links JSON;
ALTER TABLE users ADD COLUMN level INT DEFAULT 1;
ALTER TABLE users ADD COLUMN xp INT DEFAULT 0;
```

### **user_stats table (enhanced):**
```sql
CREATE TABLE user_stats (
  user_id VARCHAR(36) PRIMARY KEY,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  kills INT DEFAULT 0,
  deaths INT DEFAULT 0,
  assists INT DEFAULT 0,
  kd_ratio DECIMAL(5,2) DEFAULT 0.00,
  mvp_count INT DEFAULT 0,
  total_points INT DEFAULT 0,
  tournaments_participated INT DEFAULT 0,
  tournaments_won INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **badges table:**
```sql
CREATE TABLE badges (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
  requirement TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **user_badges table:**
```sql
CREATE TABLE user_badges (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  badge_id VARCHAR(36) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id),
  UNIQUE KEY unique_user_badge (user_id, badge_id)
);
```

### **user_preferences table:**
```sql
CREATE TABLE user_preferences (
  user_id VARCHAR(36) PRIMARY KEY,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  tournament_notifications BOOLEAN DEFAULT TRUE,
  tower_notifications BOOLEAN DEFAULT TRUE,
  profile_visibility ENUM('public', 'friends', 'private') DEFAULT 'public',
  stats_visibility ENUM('public', 'friends', 'private') DEFAULT 'public',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🎯 Implementation Guide

### **Step 1: Update Database**
```sql
-- Run all schema updates
-- Create new tables
-- Add indexes
```

### **Step 2: Update Types**
```typescript
// Already done in lib/types.ts
// User, UserStats, Badge, Achievement, UserProfile
```

### **Step 3: Create Profile Page**
```tsx
// app/profile/[id]/page.tsx
// With 5 tabs: Overview, Stats, Tournaments, Achievements, Settings
```

### **Step 4: Create Components**
```tsx
// components/profile/ProfileOverview.tsx
// components/profile/StatsTab.tsx
// components/profile/TournamentsTab.tsx
// components/profile/AchievementsTab.tsx
// components/profile/SettingsTab.tsx
// components/profile/BadgeCard.tsx
// components/profile/LevelProgress.tsx
```

### **Step 5: Implement APIs**
```typescript
// Backend APIs for profile, stats, badges, achievements
// XP calculation logic
// Badge unlock logic
```

### **Step 6: Add Gamification Logic**
```typescript
// XP earning on actions
// Level up notifications
// Badge unlock notifications
// Achievement tracking
```

---

## 🎨 UI Components

### **Level Progress Bar:**
```tsx
<div className="relative">
  <div className="flex justify-between mb-2">
    <span>Level {level}</span>
    <span>{xp} / {nextLevelXP} XP</span>
  </div>
  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-[#FF1A1A] to-[#FF4D4D]"
      style={{ width: `${(xp / nextLevelXP) * 100}%` }}
    />
  </div>
</div>
```

### **Badge Card:**
```tsx
<div className={`badge-card rarity-${badge.rarity}`}>
  <div className="badge-icon">{badge.icon}</div>
  <h4>{badge.name}</h4>
  <p>{badge.description}</p>
  <span className="rarity-label">{badge.rarity}</span>
</div>
```

### **Stat Card:**
```tsx
<div className="stat-card">
  <div className="stat-icon">{icon}</div>
  <div className="stat-value">{value}</div>
  <div className="stat-label">{label}</div>
</div>
```

---

## ✅ Profile Enhancement Checklist

### **Types & Interfaces:**
- [x] Enhanced User type
- [x] Enhanced UserStats type
- [x] Badge interface
- [x] Achievement interface
- [x] UserProfile interface

### **Database:**
- [ ] Update users table
- [ ] Create/update user_stats table
- [ ] Create badges table
- [ ] Create user_badges table
- [ ] Create user_preferences table

### **APIs:**
- [ ] GET /users/:id/profile
- [ ] PUT /users/:id/profile
- [ ] GET /users/:id/stats
- [ ] GET /users/:id/badges
- [ ] GET /users/:id/achievements
- [ ] GET /users/:id/tournaments
- [ ] PATCH /users/:id/preferences
- [ ] POST /users/:id/change-password

### **Components:**
- [ ] Enhanced profile page with tabs
- [ ] ProfileOverview component
- [ ] StatsTab component
- [ ] TournamentsTab component
- [ ] AchievementsTab component
- [ ] SettingsTab component
- [ ] BadgeCard component
- [ ] LevelProgress component

### **Features:**
- [ ] XP earning system
- [ ] Level calculation
- [ ] Badge unlock logic
- [ ] Achievement tracking
- [ ] Notification preferences
- [ ] Password change
- [ ] Social links

---

**Profile Enhancement System Complete! 🎮👤**

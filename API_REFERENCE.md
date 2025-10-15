# 🔌 API Endpoints Reference - Complete List

## Base URL
```
http://localhost:8000/api
```

---

## 🏆 Tournament APIs

### **GET /tournaments**
Get all tournaments with filters
```javascript
Query Params:
  - status: 'upcoming' | 'ongoing' | 'completed'
  - game: 'BGMI' | 'FF' | 'VALORANT' | 'COD' | 'OTHER'
  - page: number
  - limit: number

Response: PaginatedResponse<Tournament[]>
```

### **GET /tournaments/:id**
Get single tournament details
```javascript
Response: Tournament
```

### **POST /tournaments**
Create new tournament (Organizer only)
```javascript
Auth: Required (Organizer role)
Content-Type: multipart/form-data

Body:
  - title: string (required)
  - game: GameType (required)
  - mapPool: MapType[] (required for BGMI)
  - description: string (required)
  - rules: string (optional)
  - banner: File (optional)
  - logo: File (optional)
  - status: TournamentStatus (required)
  - maxTeams: number (required)
  - entryFee: number (optional)
  - prizePool: string (optional)
  - dateTime: string (required)
  - allowedTowerIds: string[] (optional)

Response: Tournament
```

### **PUT /tournaments/:id**
Update tournament (Organizer only)
```javascript
Auth: Required (Organizer role)
Content-Type: multipart/form-data
Body: Same as POST (all optional)
Response: Tournament
```

### **DELETE /tournaments/:id**
Delete tournament (Organizer only)
```javascript
Auth: Required (Organizer role)
Response: { success: boolean }
```

### **GET /tournaments/:id/teams**
Get registered teams for tournament
```javascript
Response: TournamentTeam[]
```

### **PATCH /tournaments/:id/teams/:teamId**
Approve/Reject team registration (Organizer only)
```javascript
Auth: Required (Organizer role)
Body: { status: 'approved' | 'rejected' }
Response: TournamentTeam
```

### **PATCH /tournaments/:id/room**
Update room details (Organizer only)
```javascript
Auth: Required (Organizer role)
Body: {
  roomId: string,
  roomPassword: string
}
Response: Tournament
```

### **POST /tournaments/:id/send-room-details**
Send room details to all approved teams (Organizer only)
```javascript
Auth: Required (Organizer role)
Response: { sent: number }
Action: Creates notifications for all approved team members
```

---

## 🏰 Tower APIs

### **GET /towers**
Get all towers or user's towers
```javascript
Query Params:
  - userId: string (optional)

Response: Tower[]
```

### **GET /towers/:id**
Get tower details
```javascript
Response: Tower (with teams populated)
```

### **POST /towers**
Create new tower
```javascript
Auth: Required
Content-Type: multipart/form-data

Body:
  - name: string (required)
  - logo: File (optional)
  - maxTeams: number (required)

Response: Tower (with generated code)
```

### **PUT /towers/:id**
Update tower (Owner only)
```javascript
Auth: Required (Owner/Co-leader)
Content-Type: multipart/form-data
Body: Same as POST (all optional)
Response: Tower
```

### **DELETE /towers/:id**
Delete tower (Owner only)
```javascript
Auth: Required (Owner only)
Response: { success: boolean }
```

### **POST /towers/join**
Join tower with code
```javascript
Auth: Required
Body: {
  code: string,
  userId: string
}
Response: Tower
```

### **POST /towers/:id/co-leaders**
Add co-leader (Owner only, max 1)
```javascript
Auth: Required (Owner only)
Body: { userId: string }
Response: Tower
Validation: Only 1 co-leader allowed
```

### **DELETE /towers/:id/co-leaders/:userId**
Remove co-leader (Owner only)
```javascript
Auth: Required (Owner only)
Response: Tower
```

### **POST /towers/:id/register-teams**
Register teams to tournament (Owner/Co-leader only)
```javascript
Auth: Required (Owner/Co-leader)
Body: {
  tournamentId: string,
  teamIds: string[]
}
Response: TournamentTeam[]
Validation:
  - Check duplicates
  - Check max teams
  - Check tower allowed
```

---

## 👥 Team APIs

### **GET /teams**
Get all teams or tower's teams
```javascript
Query Params:
  - towerId: string (optional)

Response: Team[]
```

### **GET /teams/:id**
Get team details
```javascript
Response: Team (with members populated)
```

### **POST /teams**
Create new team (Tower Owner/Co-leader only)
```javascript
Auth: Required (Owner/Co-leader)
Content-Type: multipart/form-data

Body:
  - name: string (required)
  - logo: File (required)
  - towerId: string (required)
  - captainId: string (required)
  - memberIds: string[] (required)

Response: Team
Validation:
  - Name unique within tower
  - Logo required
  - Captain must be in members
```

### **PUT /teams/:id**
Update team (Owner/Co-leader only)
```javascript
Auth: Required (Owner/Co-leader)
Content-Type: multipart/form-data
Body: Same as POST (all optional)
Response: Team
```

### **DELETE /teams/:id**
Delete team (Owner/Co-leader only)
```javascript
Auth: Required (Owner/Co-leader)
Response: { success: boolean }
```

### **POST /teams/:id/members**
Add member to team
```javascript
Auth: Required (Owner/Co-leader/Captain)
Body: { userId: string }
Response: Team
```

### **DELETE /teams/:id/members/:userId**
Remove member from team
```javascript
Auth: Required (Owner/Co-leader/Captain)
Response: Team
```

---

## 👤 User APIs

### **GET /users/:id**
Get user profile
```javascript
Response: User
```

### **PUT /users/:id**
Update user profile
```javascript
Auth: Required (Self only)
Content-Type: multipart/form-data

Body:
  - name: string (optional)
  - username: string (optional)
  - bio: string (optional)
  - gameId: string (optional)
  - avatar: File (optional)

Response: User
```

### **GET /users/search**
Search users by name or username
```javascript
Query Params:
  - q: string (search query)

Response: User[]
```

### **GET /users/:id/stats**
Get user statistics
```javascript
Response: UserStats {
  matchesPlayed: number,
  wins: number,
  kills: number,
  deaths: number,
  assists: number,
  tournamentsParticipated: number,
  tournamentsWon: number
}
```

### **GET /users/:id/achievements**
Get user achievements
```javascript
Response: Achievement[]
```

---

## 👑 Organizer APIs

### **POST /organizer/apply**
Apply for organizer role
```javascript
Auth: Required (Player role)
Body: {
  reason: string (required),
  experience: string (optional),
  youtube: string (optional),
  instagram: string (optional),
  discord: string (optional)
}
Response: OrganizerApplication
```

### **GET /organizer/my-application**
Get my application status
```javascript
Auth: Required
Response: OrganizerApplication
```

### **GET /organizer/applications**
Get all applications (Super Admin only)
```javascript
Auth: Required (Super Admin)
Query Params:
  - status: 'pending' | 'approved' | 'rejected' (optional)

Response: OrganizerApplication[]
```

### **PATCH /organizer/applications/:id/review**
Review application (Super Admin only)
```javascript
Auth: Required (Super Admin)
Body: {
  status: 'approved' | 'rejected',
  reviewNotes: string (optional)
}
Response: OrganizerApplication
Action: If approved, update user role to 'organizer'
```

### **GET /organizer/list**
Get all organizers (Super Admin only)
```javascript
Auth: Required (Super Admin)
Response: User[]
```

### **PATCH /organizer/:id/toggle-status**
Block/Unblock organizer (Super Admin only)
```javascript
Auth: Required (Super Admin)
Body: { isBlocked: boolean }
Response: User
```

---

## 🔔 Notification APIs

### **GET /notifications**
Get user notifications
```javascript
Auth: Required
Query Params:
  - unreadOnly: boolean (optional)

Response: Notification[]
```

### **PATCH /notifications/:id/read**
Mark notification as read
```javascript
Auth: Required
Response: Notification
```

### **PATCH /notifications/read-all**
Mark all notifications as read
```javascript
Auth: Required
Response: { success: boolean }
```

### **DELETE /notifications/:id**
Delete notification
```javascript
Auth: Required
Response: { success: boolean }
```

---

## 🔐 Authentication APIs

### **POST /auth/signup**
User registration
```javascript
Body: {
  name: string,
  username: string,
  email: string,
  mobile: string,
  password: string,
  gameId: string (optional)
}
Response: {
  user: User,
  token: string
}
```

### **POST /auth/login**
User login
```javascript
Body: {
  mobile: string,
  password: string
}
Response: {
  user: User,
  token: string
}
```

### **GET /auth/me**
Get current user
```javascript
Auth: Required
Response: User
```

### **POST /auth/logout**
User logout
```javascript
Auth: Required
Response: { success: boolean }
```

---

## 📊 Response Formats

### **Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### **Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### **Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🔒 Authentication

### **Header Format:**
```
Authorization: Bearer <JWT_TOKEN>
```

### **Token Payload:**
```json
{
  "userId": "uuid",
  "role": "player | organizer | superAdmin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## ✅ Validation Rules

### **Tournament Registration:**
1. Team not already registered ✅
2. Tournament not full (maxTeams) ✅
3. Team name unique in tournament ✅
4. User is tower owner/co-leader ✅
5. Tower allowed (if restrictions) ✅

### **Team Creation:**
1. Name unique within tower ✅
2. Logo required ✅
3. Captain in members list ✅
4. Tower not at max teams ✅

### **Tower Creation:**
1. Name unique globally ✅
2. Code unique (auto-generated) ✅
3. Max teams between 1-50 ✅

### **Organizer Application:**
1. User role is 'player' ✅
2. No pending application ✅
3. Reason provided ✅

---

## 📝 Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (no token)
- **403** - Forbidden (wrong role)
- **404** - Not Found
- **409** - Conflict (duplicate)
- **500** - Server Error

---

## 🎯 Total Endpoints: 46

- **Tournaments:** 9 endpoints
- **Towers:** 8 endpoints
- **Teams:** 7 endpoints
- **Users:** 5 endpoints
- **Organizer:** 6 endpoints
- **Notifications:** 4 endpoints
- **Authentication:** 4 endpoints
- **Stats:** 3 endpoints

---

**Backend Implementation Guide Complete! 🚀**

# 🎮 EsportsNeo - Backend API Documentation

**Backend Base URL:** `https://techbranzzo.com/api`

This document lists all backend API endpoints integrated in the EsportsNeo frontend application.

---

## 🔐 Authentication APIs

### Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Create a new user account
- **Request Body:**
  ```json
  {
    "name": "string",
    "username": "string",
    "mobile": "string (10 digits)",
    "password": "string (min 6 chars)",
    "email": "string (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "user": { "id": "string", "name": "string", "username": "string", ... }
  }
  ```

### Login User
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and get JWT token
- **Request Body:**
  ```json
  {
    "mobile": "string (10 digits)",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "user": { "id": "string", "name": "string", "role": "string", ... }
  }
  ```

---

## 🏆 Tournament APIs

### Get All Tournaments
- **Endpoint:** `GET /api/tournaments`
- **Query Params:** `status`, `game`, `page`, `limit`
- **Description:** Fetch all tournaments with optional filters
- **Response:** Paginated list of tournaments

### Get Tournament by ID
- **Endpoint:** `GET /api/tournaments/:id`
- **Description:** Get detailed information about a specific tournament

### Create Tournament
- **Endpoint:** `POST /api/tournaments`
- **Auth Required:** Yes (Organizer/Admin)
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `title`, `game`, `description`, `status`, `maxTeams`
  - `banner` (file), `logo` (file)

### Update Tournament
- **Endpoint:** `PUT /api/tournaments/:id`
- **Auth Required:** Yes (Organizer/Admin)
- **Content-Type:** `multipart/form-data`

### Delete Tournament
- **Endpoint:** `DELETE /api/tournaments/:id`
- **Auth Required:** Yes (Organizer/Admin)

### Get Registered Teams
- **Endpoint:** `GET /api/tournaments/:tournamentId/teams`
- **Description:** Get all teams registered for a tournament

### Update Team Registration Status
- **Endpoint:** `PATCH /api/tournaments/:tournamentId/teams/:teamId`
- **Auth Required:** Yes (Organizer)
- **Request Body:**
  ```json
  {
    "status": "approved" | "rejected"
  }
  ```

### Update Room Details
- **Endpoint:** `PATCH /api/tournaments/:tournamentId/room`
- **Auth Required:** Yes (Organizer)
- **Request Body:**
  ```json
  {
    "roomId": "string",
    "roomPassword": "string"
  }
  ```

### Send Room Details to Teams
- **Endpoint:** `POST /api/tournaments/:tournamentId/send-room-details`
- **Auth Required:** Yes (Organizer)
- **Description:** Notify all approved teams with room credentials

---

## 🏰 Tower APIs

### Get All Towers
- **Endpoint:** `GET /api/towers`
- **Query Params:** `userId` (optional)
- **Description:** Get all towers or user-specific towers

### Get Tower by ID
- **Endpoint:** `GET /api/towers/:id`
- **Description:** Get basic tower information

### Get Tower Overview
- **Endpoint:** `GET /api/towers/:towerId/overview`
- **Description:** Complete tower data with members, teams, and stats

### Get Tower Members
- **Endpoint:** `GET /api/towers/:towerId/members`
- **Description:** Get all tower members with performance data

### Get Tower Teams Status
- **Endpoint:** `GET /api/towers/:towerId/teams-status`
- **Description:** Get teams with their current status (free/registered/inTournament)

### Get Tower Tournaments
- **Endpoint:** `GET /api/towers/:towerId/tournaments`
- **Query Params:** `status` (ongoing/pending/past)
- **Description:** Get tournaments associated with the tower

### Get Member Leaderboard
- **Endpoint:** `GET /api/towers/:towerId/leaderboard`
- **Query Params:** `period` (week/month/allTime)
- **Description:** Performance rankings of tower members

### Get Announcements
- **Endpoint:** `GET /api/towers/:towerId/announcements`
- **Description:** Get all tower announcements

### Create Announcement
- **Endpoint:** `POST /api/towers/:towerId/announcements`
- **Auth Required:** Yes (Owner/Co-Leader)
- **Request Body:**
  ```json
  {
    "title": "string",
    "content": "string",
    "priority": "low" | "medium" | "high"
  }
  ```

### Create Tower
- **Endpoint:** `POST /api/towers`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "logo": "string (optional)",
    "banner": "string (optional)",
    "maxTeams": "number"
  }
  ```

### Update Tower Settings
- **Endpoint:** `PUT /api/towers/:towerId/settings`
- **Auth Required:** Yes (Owner/Co-Leader)
- **Request Body:** Partial tower data

### Delete Tower
- **Endpoint:** `DELETE /api/towers/:id`
- **Auth Required:** Yes (Owner)

### Promote Member to Elite
- **Endpoint:** `POST /api/towers/:towerId/members/:memberId/promote`
- **Auth Required:** Yes (Owner/Co-Leader)

### Demote Member to Regular
- **Endpoint:** `POST /api/towers/:towerId/members/:memberId/demote`
- **Auth Required:** Yes (Owner/Co-Leader)

### Remove Member
- **Endpoint:** `DELETE /api/towers/:towerId/members/:memberId`
- **Auth Required:** Yes (Owner/Co-Leader)

### Assign Co-Leader
- **Endpoint:** `POST /api/towers/:towerId/assign-coleader/:userId`
- **Auth Required:** Yes (Owner)

### Remove Co-Leader
- **Endpoint:** `DELETE /api/towers/:towerId/coleader`
- **Auth Required:** Yes (Owner)

### Join Tower with Code
- **Endpoint:** `POST /api/towers/join`
- **Request Body:**
  ```json
  {
    "code": "string",
    "userId": "string"
  }
  ```

### Register Teams to Tournament
- **Endpoint:** `POST /api/towers/:towerId/register-teams`
- **Auth Required:** Yes (Owner/Co-Leader)
- **Request Body:**
  ```json
  {
    "tournamentId": "string",
    "teamIds": ["string"]
  }
  ```

---

## 👥 Team APIs

### Get All Teams
- **Endpoint:** `GET /api/teams`
- **Query Params:** `towerId` (optional)
- **Description:** Get all teams or tower-specific teams

### Get Team by ID
- **Endpoint:** `GET /api/teams/:id`
- **Description:** Get detailed team information

### Create Team
- **Endpoint:** `POST /api/teams`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `name`, `towerId`, `captainId`, `memberIds` (JSON array)
  - `logo` (file)

### Update Team
- **Endpoint:** `PUT /api/teams/:id`
- **Auth Required:** Yes (Captain/Tower Owner)
- **Content-Type:** `multipart/form-data`

### Delete Team
- **Endpoint:** `DELETE /api/teams/:id`
- **Auth Required:** Yes (Captain/Tower Owner)

### Add Team Member
- **Endpoint:** `POST /api/teams/:teamId/members`
- **Auth Required:** Yes (Captain)
- **Request Body:**
  ```json
  {
    "userId": "string"
  }
  ```

### Remove Team Member
- **Endpoint:** `DELETE /api/teams/:teamId/members/:userId`
- **Auth Required:** Yes (Captain)

---

## 👤 User APIs

### Get User Profile
- **Endpoint:** `GET /api/users/:id`
- **Description:** Get user profile information

### Update User Profile
- **Endpoint:** `PUT /api/users/:id`
- **Auth Required:** Yes (Own profile)
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `name`, `username`, `bio`
  - `avatar` (file)

### Search Users
- **Endpoint:** `GET /api/users/search`
- **Query Params:** `q` (search query)
- **Description:** Search users by name or username

### Get User Stats
- **Endpoint:** `GET /api/users/:userId/stats`
- **Description:** Get user performance statistics

### Get User Achievements
- **Endpoint:** `GET /api/users/:userId/achievements`
- **Description:** Get user's earned achievements

---

## 🏅 Leaderboard APIs

### Get Players Leaderboard
- **Endpoint:** `GET /api/leaderboard/players`
- **Query Params:** `period` (week/month/allTime), `limit`
- **Description:** Top performing players

### Get Teams Leaderboard
- **Endpoint:** `GET /api/leaderboard/teams`
- **Query Params:** `period` (week/month/allTime), `limit`
- **Description:** Top performing teams

### Get Towers Leaderboard
- **Endpoint:** `GET /api/leaderboard/towers`
- **Query Params:** `period` (week/month/allTime), `limit`
- **Description:** Top performing towers

---

## 🎯 Organizer APIs

### Apply for Organizer Role
- **Endpoint:** `POST /api/organizer/apply`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "experience": "string",
    "reason": "string",
    "portfolio": "string (optional)"
  }
  ```

### Get My Application Status
- **Endpoint:** `GET /api/organizer/my-application`
- **Auth Required:** Yes
- **Description:** Check organizer application status

### Get All Applications
- **Endpoint:** `GET /api/organizer/applications`
- **Auth Required:** Yes (Super Admin)
- **Query Params:** `status` (pending/approved/rejected)

### Review Application
- **Endpoint:** `PATCH /api/organizer/applications/:applicationId/review`
- **Auth Required:** Yes (Super Admin)
- **Request Body:**
  ```json
  {
    "status": "approved" | "rejected",
    "feedback": "string (optional)"
  }
  ```

### Get All Organizers
- **Endpoint:** `GET /api/organizer/list`
- **Auth Required:** Yes (Super Admin)

### Toggle Organizer Status
- **Endpoint:** `PATCH /api/organizer/:organizerId/toggle-status`
- **Auth Required:** Yes (Super Admin)
- **Request Body:**
  ```json
  {
    "isBlocked": "boolean"
  }
  ```

---

## 🔔 Notification APIs

### Get My Notifications
- **Endpoint:** `GET /api/notifications`
- **Auth Required:** Yes
- **Query Params:** `unreadOnly` (boolean)

### Mark Notification as Read
- **Endpoint:** `PATCH /api/notifications/:notificationId/read`
- **Auth Required:** Yes

### Mark All as Read
- **Endpoint:** `PATCH /api/notifications/read-all`
- **Auth Required:** Yes

### Delete Notification
- **Endpoint:** `DELETE /api/notifications/:notificationId`
- **Auth Required:** Yes

---

## 🔑 Authentication Headers

All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained from login/register endpoints and stored in `localStorage`.

---

## 📝 Notes

- All file uploads use `multipart/form-data`
- All other requests use `application/json`
- Errors return standardized format:
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```
- Success responses include:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional success message"
  }
  ```

---

**Last Updated:** October 2025  
**Backend:** https://techbranzzo.com  
**Frontend:** EsportsNeo Next.js Application

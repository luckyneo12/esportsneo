# Tower API Reference - Complete Documentation

## 📋 Table of Contents
1. [Overview Endpoints](#overview-endpoints)
2. [Member Management](#member-management)
3. [Team Management](#team-management)
4. [Tournament Integration](#tournament-integration)
5. [Announcements](#announcements)
6. [Settings & Administration](#settings--administration)
7. [Request/Response Examples](#requestresponse-examples)

---

## 🏰 Overview Endpoints

### 1. Get Complete Tower Overview
```http
GET /towers/:towerId/overview
```

**Description:** Get complete tower information including members, teams, and statistics.

**Response:**
```json
{
  "id": "1",
  "name": "Phoenix Esports",
  "logo": "https://...",
  "banner": "https://...",
  "code": "PHX2024",
  "description": "Professional esports tower",
  "ownerId": "123",
  "owner": {
    "id": "123",
    "name": "John Doe",
    "username": "johndoe",
    "avatarUrl": "https://..."
  },
  "coLeaderId": "456",
  "coLeader": {
    "id": "456",
    "name": "Jane Smith",
    "username": "janesmith"
  },
  "maxTeams": 10,
  "members": [
    {
      "id": "1",
      "userId": "123",
      "role": "owner",
      "performancePoints": 1500,
      "joinedAt": "2024-01-01T00:00:00Z",
      "isOnline": true,
      "user": { ... }
    }
  ],
  "teams": [ ... ],
  "stats": {
    "totalMembers": 25,
    "totalTeams": 5,
    "tournamentsPlayed": 10,
    "tournamentsWon": 3,
    "totalPoints": 15000,
    "level": 5,
    "xp": 2500
  },
  "badges": ["champion_2024", "top_10"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

---

## 👥 Member Management

### 2. Get Tower Members
```http
GET /towers/:towerId/members
```

**Description:** Get all tower members with performance data.

**Query Parameters:**
- `sort` (optional): `performance` | `joinDate` | `name`
- `role` (optional): `owner` | `coLeader` | `eliteMember` | `member`

**Response:**
```json
{
  "members": [
    {
      "id": "1",
      "userId": "123",
      "towerId": "1",
      "role": "owner",
      "performancePoints": 1500,
      "joinedAt": "2024-01-01T00:00:00Z",
      "isOnline": true,
      "user": {
        "id": "123",
        "name": "John Doe",
        "username": "johndoe",
        "avatarUrl": "https://...",
        "level": 25,
        "xp": 5000
      }
    }
  ],
  "total": 25
}
```

### 3. Promote Member to Elite
```http
POST /towers/:towerId/members/:memberId/promote
```

**Description:** Promote a regular member to elite member status.

**Authorization:** Owner or Co-Leader only

**Response:**
```json
{
  "success": true,
  "message": "Member promoted to elite",
  "member": {
    "id": "1",
    "role": "eliteMember",
    ...
  }
}
```

### 4. Demote Member to Regular
```http
POST /towers/:towerId/members/:memberId/demote
```

**Description:** Demote an elite member to regular member.

**Authorization:** Owner or Co-Leader only

**Response:**
```json
{
  "success": true,
  "message": "Member demoted to regular",
  "member": {
    "id": "1",
    "role": "member",
    ...
  }
}
```

### 5. Remove Member
```http
DELETE /towers/:towerId/members/:memberId
```

**Description:** Remove a member from the tower.

**Authorization:** Owner or Co-Leader only

**Response:**
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

---

## 🛡️ Team Management

### 6. Get Teams with Status
```http
GET /towers/:towerId/teams-status
```

**Description:** Get all teams with their current status (free/registered/inTournament).

**Response:**
```json
{
  "teams": [
    {
      "id": "1",
      "name": "Alpha Squad",
      "logo": "https://...",
      "towerId": "1",
      "captainId": "123",
      "captain": { ... },
      "members": [ ... ],
      "maxMembers": 4,
      "status": "registered",
      "currentTournamentId": "10",
      "slotNumber": 5,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "summary": {
    "total": 5,
    "free": 2,
    "registered": 2,
    "inTournament": 1
  }
}
```

---

## 🏆 Tournament Integration

### 7. Get Tower Tournaments
```http
GET /towers/:towerId/tournaments?status=ongoing
```

**Description:** Get tournaments where tower teams are participating.

**Query Parameters:**
- `status` (optional): `ongoing` | `pending` | `past`

**Response:**
```json
{
  "tournaments": [
    {
      "id": "10",
      "title": "BGMI Championship 2024",
      "status": "ongoing",
      "startDate": "2024-02-01T00:00:00Z",
      "teams": [
        {
          "teamId": "1",
          "teamName": "Alpha Squad",
          "slotNumber": 5,
          "status": "confirmed",
          "roomId": "12345",
          "roomPassword": "pass123"
        }
      ],
      "stats": {
        "teamsRegistered": 2,
        "teamsConfirmed": 1,
        "teamsPending": 1
      }
    }
  ],
  "summary": {
    "ongoing": 1,
    "pending": 2,
    "past": 5
  }
}
```

### 8. Get Performance Leaderboard
```http
GET /towers/:towerId/leaderboard
```

**Description:** Get tower member performance leaderboard.

**Query Parameters:**
- `period` (optional): `week` | `month` | `allTime` (default: `allTime`)
- `limit` (optional): number (default: 50)

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "123",
      "user": {
        "id": "123",
        "name": "John Doe",
        "username": "johndoe",
        "avatarUrl": "https://..."
      },
      "performancePoints": 1500,
      "matchesPlayed": 50,
      "wins": 15,
      "kills": 250,
      "mvpCount": 10,
      "kdRatio": 3.5
    }
  ],
  "period": "allTime",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

---

## 📢 Announcements

### 9. Get Announcements
```http
GET /towers/:towerId/announcements
```

**Description:** Get tower announcements/bulletin board.

**Query Parameters:**
- `limit` (optional): number (default: 20)
- `priority` (optional): `low` | `medium` | `high`

**Response:**
```json
{
  "announcements": [
    {
      "id": "1",
      "towerId": "1",
      "title": "Tournament Registration Open",
      "content": "Register your teams for the upcoming championship...",
      "priority": "high",
      "createdBy": "123",
      "createdByUser": {
        "id": "123",
        "name": "John Doe",
        "role": "owner"
      },
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "total": 10
}
```

### 10. Create Announcement
```http
POST /towers/:towerId/announcements
```

**Description:** Create a new announcement (Owner/Co-Leader only).

**Authorization:** Owner or Co-Leader only

**Request Body:**
```json
{
  "title": "Tournament Registration Open",
  "content": "Register your teams for the upcoming championship. Deadline: Jan 20, 2024",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Announcement created successfully",
  "announcement": {
    "id": "1",
    "towerId": "1",
    "title": "Tournament Registration Open",
    "content": "...",
    "priority": "high",
    "createdBy": "123",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

---

## ⚙️ Settings & Administration

### 11. Update Tower Settings
```http
PUT /towers/:towerId/settings
```

**Description:** Update tower settings (Owner/Co-Leader only).

**Authorization:** Owner or Co-Leader only

**Request Body:**
```json
{
  "name": "Phoenix Esports Pro",
  "logo": "https://...",
  "banner": "https://...",
  "description": "Updated description",
  "maxTeams": 15
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tower settings updated",
  "tower": { ... }
}
```

### 12. Assign Co-Leader
```http
POST /towers/:towerId/assign-coleader/:userId
```

**Description:** Assign a member as co-leader (Owner only).

**Authorization:** Owner only

**Response:**
```json
{
  "success": true,
  "message": "Co-leader assigned successfully",
  "tower": {
    "id": "1",
    "coLeaderId": "456",
    "coLeader": { ... }
  }
}
```

### 13. Remove Co-Leader
```http
DELETE /towers/:towerId/coleader
```

**Description:** Remove current co-leader (Owner only).

**Authorization:** Owner only

**Response:**
```json
{
  "success": true,
  "message": "Co-leader removed successfully",
  "tower": {
    "id": "1",
    "coLeaderId": null,
    "coLeader": null
  }
}
```

### 14. Delete Tower
```http
DELETE /towers/:towerId
```

**Description:** Permanently delete tower (Owner only).

**Authorization:** Owner only

**Response:**
```json
{
  "success": true,
  "message": "Tower deleted successfully"
}
```

---

## 📝 Request/Response Examples

### Frontend Usage Examples

```typescript
import { towerApi } from '@/lib/api';

// 1. Get tower overview
const overview = await towerApi.getOverview('tower-id');
if (overview.success) {
  console.log(overview.data);
}

// 2. Get members
const members = await towerApi.getMembers('tower-id');

// 3. Promote member
const promote = await towerApi.promoteMember('tower-id', 'member-id');

// 4. Get tournaments
const tournaments = await towerApi.getTournaments('tower-id', { status: 'ongoing' });

// 5. Create announcement
const announcement = await towerApi.createAnnouncement('tower-id', {
  title: 'Important Update',
  content: 'Tournament starts tomorrow!',
  priority: 'high'
});

// 6. Update settings
const settings = await towerApi.updateSettings('tower-id', {
  name: 'New Tower Name',
  description: 'Updated description'
});

// 7. Assign co-leader
const assignCo = await towerApi.assignCoLeader('tower-id', 'user-id');

// 8. Remove member
const remove = await towerApi.removeMember('tower-id', 'member-id');
```

---

## 🔒 Authorization & Permissions

### Permission Levels

| Action | Owner | Co-Leader | Elite Member | Member |
|--------|-------|-----------|--------------|--------|
| View Overview | ✅ | ✅ | ✅ | ✅ |
| View Members | ✅ | ✅ | ✅ | ✅ |
| View Teams | ✅ | ✅ | ✅ | ✅ |
| View Tournaments | ✅ | ✅ | ✅ | ✅ |
| View Leaderboard | ✅ | ✅ | ✅ | ✅ |
| View Announcements | ✅ | ✅ | ✅ | ✅ |
| Create Announcement | ✅ | ✅ | ❌ | ❌ |
| Promote/Demote Members | ✅ | ✅ | ❌ | ❌ |
| Remove Members | ✅ | ✅ | ❌ | ❌ |
| Update Settings | ✅ | ✅ | ❌ | ❌ |
| Assign Co-Leader | ✅ | ❌ | ❌ | ❌ |
| Remove Co-Leader | ✅ | ❌ | ❌ | ❌ |
| Delete Tower | ✅ | ❌ | ❌ | ❌ |

---

## 🚨 Error Responses

### Common Error Codes

```json
{
  "success": false,
  "error": "Unauthorized",
  "code": 401,
  "message": "You don't have permission to perform this action"
}
```

### Error Codes
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (tower/member/team not found)
- `409` - Conflict (duplicate name, etc.)
- `500` - Server Error

---

## 📊 Rate Limiting

- **Standard endpoints**: 100 requests/minute
- **Overview endpoint**: 30 requests/minute
- **Leaderboard endpoint**: 20 requests/minute

---

## 🔄 Webhooks (Future Feature)

Tower events that can trigger webhooks:
- Member joined/left
- Team created/deleted
- Tournament registration
- Announcement posted
- Co-leader assigned/removed

---

**Version**: 1.0.0  
**Last Updated**: Oct 14, 2025  
**Status**: Ready for Backend Implementation ✅

# 🔧 Backend Implementation Checklist

## 📋 Database Setup

### **1. Create MySQL Database**
```sql
CREATE DATABASE esportsneo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE esportsneo;
```

### **2. Create Tables**

#### ✅ Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  role ENUM('player', 'towerOwner', 'organiser', 'admin') DEFAULT 'player',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_mobile (mobile),
  INDEX idx_role (role)
);
```

#### ✅ Towers Table
```sql
CREATE TABLE towers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(8) UNIQUE NOT NULL,
  owner_id VARCHAR(36) NOT NULL,
  co_leaders JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_code (code),
  INDEX idx_owner (owner_id)
);
```

#### ✅ Teams Table
```sql
CREATE TABLE teams (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  tower_id VARCHAR(36) NOT NULL,
  captain_id VARCHAR(36) NOT NULL,
  members JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tower_id) REFERENCES towers(id) ON DELETE CASCADE,
  FOREIGN KEY (captain_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_team_per_tower (name, tower_id),
  INDEX idx_tower (tower_id),
  INDEX idx_captain (captain_id)
);
```

#### ✅ Tournaments Table
```sql
CREATE TABLE tournaments (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  game ENUM('BGMI', 'FF', 'VALORANT', 'COD', 'OTHER') NOT NULL,
  description TEXT NOT NULL,
  banner VARCHAR(255) DEFAULT NULL,
  logo VARCHAR(255) DEFAULT NULL,
  status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
  max_teams INT NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_game (game),
  INDEX idx_created_by (created_by)
);
```

#### ✅ Tournament Teams Table
```sql
CREATE TABLE tournament_teams (
  id VARCHAR(36) PRIMARY KEY,
  tournament_id VARCHAR(36) NOT NULL,
  team_id VARCHAR(36) NOT NULL,
  registered_by VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_team_per_tournament (tournament_id, team_id),
  INDEX idx_tournament (tournament_id),
  INDEX idx_team (team_id),
  INDEX idx_status (status)
);
```

---

## 🔐 Authentication Setup

### **1. Install Dependencies**
```bash
npm install express mysql2 bcryptjs jsonwebtoken multer cors dotenv
npm install --save-dev @types/express @types/bcryptjs @types/jsonwebtoken @types/multer
```

### **2. Environment Variables (.env)**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=esportsneo

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=8000
NODE_ENV=development

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS
FRONTEND_URL=http://localhost:3000
```

### **3. JWT Middleware**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
```

---

## 📁 File Upload Setup

### **1. Multer Configuration**
```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/avatars', 'uploads/logos', 'uploads/banners', 'uploads/teams'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'avatar') uploadPath += 'avatars/';
    else if (file.fieldname === 'logo') uploadPath += 'logos/';
    else if (file.fieldname === 'banner') uploadPath += 'banners/';
    else if (file.fieldname === 'teamLogo') uploadPath += 'teams/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = upload;
```

---

## 🛣️ API Routes Implementation

### **Tournament Routes**
```javascript
// routes/tournaments.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');
const tournamentController = require('../controllers/tournamentController');

// Public routes
router.get('/', tournamentController.getAll);
router.get('/:id', tournamentController.getById);
router.get('/:id/teams', tournamentController.getRegisteredTeams);

// Protected routes (Admin/Organiser only)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'organiser'),
  upload.fields([{ name: 'banner' }, { name: 'logo' }]),
  tournamentController.create
);

router.put('/:id',
  authenticateToken,
  authorizeRoles('admin', 'organiser'),
  upload.fields([{ name: 'banner' }, { name: 'logo' }]),
  tournamentController.update
);

router.delete('/:id',
  authenticateToken,
  authorizeRoles('admin', 'organiser'),
  tournamentController.delete
);

router.patch('/:id/teams/:teamId',
  authenticateToken,
  authorizeRoles('admin', 'organiser'),
  tournamentController.updateTeamStatus
);

module.exports = router;
```

### **Tower Routes**
```javascript
// routes/towers.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const towerController = require('../controllers/towerController');

router.get('/', towerController.getAll);
router.get('/:id', towerController.getById);

router.post('/', authenticateToken, towerController.create);
router.put('/:id', authenticateToken, towerController.update);
router.delete('/:id', authenticateToken, towerController.delete);

router.post('/join', authenticateToken, towerController.joinWithCode);
router.post('/:id/co-leaders', authenticateToken, towerController.addCoLeader);
router.delete('/:id/co-leaders/:userId', authenticateToken, towerController.removeCoLeader);
router.post('/:id/register-teams', authenticateToken, towerController.registerTeams);

module.exports = router;
```

### **Team Routes**
```javascript
// routes/teams.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);

router.post('/',
  authenticateToken,
  upload.single('logo'),
  teamController.create
);

router.put('/:id',
  authenticateToken,
  upload.single('logo'),
  teamController.update
);

router.delete('/:id', authenticateToken, teamController.delete);
router.post('/:id/members', authenticateToken, teamController.addMember);
router.delete('/:id/members/:userId', authenticateToken, teamController.removeMember);

module.exports = router;
```

---

## ✅ Validation Functions

### **Tournament Registration Validation**
```javascript
// validators/tournamentValidator.js
const validateTeamRegistration = async (tournamentId, teamId, db) => {
  // Check if team already registered
  const [existing] = await db.query(
    'SELECT id FROM tournament_teams WHERE tournament_id = ? AND team_id = ?',
    [tournamentId, teamId]
  );
  
  if (existing.length > 0) {
    throw new Error('Team already registered for this tournament');
  }

  // Check max teams limit
  const [tournament] = await db.query(
    'SELECT max_teams FROM tournaments WHERE id = ?',
    [tournamentId]
  );
  
  const [registeredCount] = await db.query(
    'SELECT COUNT(*) as count FROM tournament_teams WHERE tournament_id = ? AND status != "rejected"',
    [tournamentId]
  );

  if (registeredCount[0].count >= tournament[0].max_teams) {
    throw new Error('Tournament is full');
  }

  return true;
};

module.exports = { validateTeamRegistration };
```

---

## 🔧 Helper Functions

### **Generate Unique Tower Code**
```javascript
// utils/codeGenerator.js
const generateTowerCode = async (db) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists = true;

  while (exists) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const [result] = await db.query('SELECT id FROM towers WHERE code = ?', [code]);
    exists = result.length > 0;
  }

  return code;
};

module.exports = { generateTowerCode };
```

---

## 📦 Complete Backend Checklist

### **Setup:**
- [ ] MySQL database created
- [ ] All tables created with indexes
- [ ] Environment variables configured
- [ ] Dependencies installed

### **Authentication:**
- [ ] JWT middleware implemented
- [ ] Role-based authorization
- [ ] Password hashing (bcrypt)
- [ ] Token generation/validation

### **File Upload:**
- [ ] Multer configured
- [ ] Upload directories created
- [ ] File type validation
- [ ] File size limits

### **API Endpoints:**
- [ ] Tournament CRUD (8 endpoints)
- [ ] Tower CRUD (8 endpoints)
- [ ] Team CRUD (7 endpoints)
- [ ] User endpoints (3 endpoints)

### **Validation:**
- [ ] Duplicate team check
- [ ] Max teams limit
- [ ] Unique constraints
- [ ] Permission checks
- [ ] Input sanitization

### **Error Handling:**
- [ ] Try-catch blocks
- [ ] Proper error messages
- [ ] HTTP status codes
- [ ] Logging system

### **Security:**
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input validation

### **Testing:**
- [ ] Unit tests
- [ ] Integration tests
- [ ] API endpoint tests
- [ ] File upload tests

---

## 🚀 Deployment

### **Production Checklist:**
- [ ] Environment variables set
- [ ] Database optimized
- [ ] File uploads configured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Logging enabled
- [ ] Backup strategy
- [ ] Monitoring setup

---

**Backend implementation guide complete! Follow this checklist for successful deployment.**

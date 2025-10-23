# Database Setup Guide

## Prerequisites
- MySQL 8.0 or higher installed
- Node.js 18+ installed

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE esportsneo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 3: Run Database Schema

Execute the schema file located at `database/schema.sql`:

```bash
mysql -u root -p esportsneo < database/schema.sql
```

Or manually run the SQL commands from `database/schema.sql` in your MySQL client.

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=esportsneo

# JWT Secret (change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Base URL (for frontend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

All API endpoints are available at `/api/*`:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile
- `GET /api/users/[id]/stats` - Get user stats
- `GET /api/users/search?q=query` - Search users

### Towers
- `GET /api/towers` - Get all towers
- `POST /api/towers` - Create tower
- `GET /api/towers/[id]` - Get tower details
- `PUT /api/towers/[id]` - Update tower
- `DELETE /api/towers/[id]` - Delete tower
- `POST /api/towers/join` - Join tower with code

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/[id]` - Get team details
- `PUT /api/teams/[id]` - Update team
- `DELETE /api/teams/[id]` - Delete team

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/[id]` - Get tournament details
- `PUT /api/tournaments/[id]` - Update tournament
- `DELETE /api/tournaments/[id]` - Delete tournament
- `POST /api/tournaments/[id]/register` - Register teams
- `GET /api/tournaments/[id]/teams` - Get registered teams

### Organizer
- `POST /api/organizer/apply` - Apply for organizer role
- `GET /api/organizer/my-application` - Get application status

## Database Tables

1. **users** - User accounts and profiles
2. **towers** - Tower organizations
3. **teams** - Teams within towers
4. **tournaments** - Tournament listings
5. **tournament_teams** - Team registrations for tournaments
6. **organizer_applications** - Organizer role applications
7. **notifications** - User notifications
8. **user_stats** - User statistics and achievements
9. **achievements** - User achievements

## File Uploads

Uploaded files are stored in `public/uploads/`:
- `avatars/` - User avatars
- `logos/` - Tower and tournament logos
- `banners/` - Tournament banners
- `teams/` - Team logos

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned from `/api/auth/login` and `/api/auth/register` endpoints.

## Testing the API

You can test the API using:
1. Postman or Insomnia
2. curl commands
3. The frontend application

Example login request:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","password":"password123"}'
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env.local`
- Ensure database exists

### File Upload Error
- Check `public/uploads/` directory exists
- Verify write permissions

### JWT Error
- Ensure JWT_SECRET is set in `.env.local`
- Check token format in Authorization header

## Production Deployment

For production:
1. Use a strong JWT_SECRET
2. Enable HTTPS
3. Configure proper CORS settings
4. Use environment-specific database credentials
5. Set up database backups
6. Configure file upload limits
7. Enable rate limiting

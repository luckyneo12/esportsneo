# Vercel Deployment Guide

## 🚨 Current Issue
Backend APIs returning 500 error on Vercel but working fine locally.

## ✅ Required Environment Variables

### Step 1: Set Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

```env
DATABASE_URL=mysql://username:password@host:3306/database_name
JWT_SECRET=your-super-secret-jwt-key-here-change-this
```

### Step 2: Database Connection String Format

**For MySQL (Recommended for Production):**
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict"
```

**Example with PlanetScale:**
```
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/esportsneo?sslaccept=strict"
```

**Example with Railway/Render:**
```
DATABASE_URL="mysql://root:password@containers-us-west-123.railway.app:3306/railway"
```

### Step 3: Generate Strong JWT Secret

Run this in terminal to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔧 Build Configuration

The `package.json` is already configured with:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

## 📋 Deployment Checklist

- [ ] Set `DATABASE_URL` in Vercel environment variables
- [ ] Set `JWT_SECRET` in Vercel environment variables
- [ ] Ensure database is accessible from Vercel's IP addresses
- [ ] Run `prisma db push` to sync schema with production database
- [ ] Redeploy on Vercel after setting environment variables

## 🗄️ Database Setup

### Option 1: PlanetScale (Recommended - Free Tier)
1. Create account at https://planetscale.com
2. Create new database
3. Get connection string
4. Add to Vercel environment variables

### Option 2: Railway (Easy Setup)
1. Create account at https://railway.app
2. Create MySQL database
3. Copy connection string
4. Add to Vercel environment variables

### Option 3: Your Own MySQL Server
Make sure:
- Server is publicly accessible
- Firewall allows Vercel IPs
- SSL is configured (recommended)

## 🔍 Debugging Steps

### 1. Check Vercel Logs
```bash
vercel logs --follow
```

### 2. Common Errors & Solutions

**Error: "Can't reach database server"**
- Solution: Check DATABASE_URL is correct
- Verify database server is accessible from internet
- Check firewall rules

**Error: "Prisma Client not generated"**
- Solution: Already fixed with `postinstall` script
- Redeploy to trigger new build

**Error: "JWT must be provided"**
- Solution: Set JWT_SECRET in environment variables

### 3. Test Database Connection

Add this test endpoint to verify database connection:

```typescript
// app/api/test-connection/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      status: 'connected', 
      userCount 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
```

## 🚀 After Setting Environment Variables

1. Go to Vercel Dashboard
2. Click "Redeploy" button
3. Wait for build to complete
4. Test your API endpoints

## 📞 Support

If still facing issues, check:
1. Vercel deployment logs
2. Database connection logs
3. Prisma schema is synced with database

## 🔐 Security Notes

- Never commit `.env` file to Git
- Use strong JWT_SECRET (minimum 32 characters)
- Enable SSL for database connections
- Rotate JWT_SECRET periodically

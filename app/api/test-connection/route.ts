import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to count users
    const userCount = await prisma.user.count();
    
    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasJwtSecret = !!process.env.JWT_SECRET;
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connected successfully',
      data: {
        userCount,
        environment: process.env.NODE_ENV,
        hasDbUrl,
        hasJwtSecret,
        prismaConnected: true
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || 'Database connection failed',
      details: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        environment: process.env.NODE_ENV,
        errorType: error.constructor.name
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

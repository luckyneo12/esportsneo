import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    
    // Get all users (for debugging)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        mobile: true,
        role: true,
      },
      take: 10
    });

    return NextResponse.json({
      status: 'Database connected!',
      totalUsers: userCount,
      users: users,
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

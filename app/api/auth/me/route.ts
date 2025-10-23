import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(authUser.userId) },
      select: {
        id: true,
        name: true,
        username: true,
        mobile: true,
        email: true,
        avatarUrl: true,
        bio: true,
        gameId: true,
        role: true,
        level: true,
        xp: true,
        matchesPlayed: true,
        matchesWon: true,
        kills: true,
        deaths: true,
        wins: true,
        mvpCount: true,
        performancePoints: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

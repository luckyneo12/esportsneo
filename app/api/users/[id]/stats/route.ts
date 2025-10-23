import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        matchesPlayed: true,
        matchesWon: true,
        kills: true,
        deaths: true,
        wins: true,
        mvpCount: true,
        performancePoints: true,
        level: true,
        xp: true,
      }
    });

    if (!user) {
      return NextResponse.json({
        matchesPlayed: 0,
        matchesWon: 0,
        kills: 0,
        deaths: 0,
        wins: 0,
        mvpCount: 0,
        performancePoints: 0,
        level: 1,
        xp: 0,
      });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

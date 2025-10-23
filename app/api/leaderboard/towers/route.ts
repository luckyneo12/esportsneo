import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const towers = await prisma.tower.findMany({
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        members: true,
        teams: true,
      },
      orderBy: {
        totalPoints: 'desc'
      },
      take: limit
    });

    const leaderboard = towers.map((tower, index) => ({
      rank: index + 1,
      towerId: tower.id.toString(),
      towerName: tower.name,
      towerLogo: tower.logoUrl,
      owner: tower.leader.name || tower.leader.username,
      location: 'India', // TODO: Add location field to schema
      totalMembers: tower.members.length,
      totalTeams: tower.teams.length,
      tournamentsPlayed: tower.tournamentsParticipated,
      tournamentsWon: tower.tournamentsWon,
      totalPoints: tower.totalPoints,
      level: tower.level,
      winRate: tower.tournamentsParticipated > 0 
        ? parseFloat(((tower.tournamentsWon / tower.tournamentsParticipated) * 100).toFixed(1)) 
        : 0,
    }));

    return NextResponse.json({ leaderboard });

  } catch (error) {
    console.error('Get towers leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

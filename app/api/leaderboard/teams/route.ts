import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '30');

    // Get all teams with their stats
    const teams = await prisma.team.findMany({
      include: {
        tower: {
          select: {
            id: true,
            name: true,
          }
        },
        captain: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                kills: true,
                deaths: true,
                wins: true,
                matchesPlayed: true,
                performancePoints: true,
              }
            }
          }
        },
        registrations: {
          where: {
            status: 'APPROVED'
          }
        }
      },
      take: limit
    });

    // Calculate team stats
    const leaderboard = teams.map((team, index) => {
      const totalKills = team.members.reduce((sum, m) => sum + m.user.kills, 0);
      const totalDeaths = team.members.reduce((sum, m) => sum + m.user.deaths, 0);
      const totalWins = team.members.reduce((sum, m) => sum + m.user.wins, 0);
      const totalMatches = team.members.reduce((sum, m) => sum + m.user.matchesPlayed, 0);
      const totalPoints = team.members.reduce((sum, m) => sum + m.user.performancePoints, 0);

      return {
        rank: index + 1,
        teamId: team.id.toString(),
        teamName: team.name,
        teamLogo: team.logoUrl,
        tower: team.tower.name,
        towerId: team.tower.id.toString(),
        captain: team.captain?.name || 'No Captain',
        matchesPlayed: Math.floor(totalMatches / (team.members.length || 1)),
        wins: totalWins,
        totalKills,
        performancePoints: totalPoints,
        tournamentsPlayed: team.registrations.length,
        tournamentsWon: 0, // TODO: Calculate from matches
        winRate: totalMatches > 0 ? parseFloat(((totalWins / totalMatches) * 100).toFixed(1)) : 0,
      };
    }).sort((a, b) => b.performancePoints - a.performancePoints);

    return NextResponse.json({ leaderboard });

  } catch (error) {
    console.error('Get teams leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'allTime';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Calculate date filter based on period
    let dateFilter = undefined;
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    }

    // Get top players
    const players = await prisma.user.findMany({
      where: dateFilter ? {
        updatedAt: dateFilter
      } : undefined,
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        matchesPlayed: true,
        matchesWon: true,
        kills: true,
        deaths: true,
        wins: true,
        mvpCount: true,
        performancePoints: true,
        level: true,
        xp: true,
        ledTowers: {
          select: {
            id: true,
            name: true,
          },
          take: 1
        }
      },
      orderBy: {
        performancePoints: 'desc'
      },
      take: limit
    });

    // Format response with rank and calculated stats
    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      userId: player.id.toString(),
      name: player.name || player.username,
      username: player.username,
      avatarUrl: player.avatarUrl,
      tower: player.ledTowers[0]?.name || null,
      towerId: player.ledTowers[0]?.id.toString() || null,
      matchesPlayed: player.matchesPlayed,
      wins: player.wins,
      kills: player.kills,
      deaths: player.deaths,
      kdRatio: player.deaths > 0 ? parseFloat((player.kills / player.deaths).toFixed(2)) : player.kills,
      mvpCount: player.mvpCount,
      performancePoints: player.performancePoints,
      level: player.level,
      xp: player.xp,
      tournamentsPlayed: 0, // TODO: Calculate from tournament_teams
      tournamentsWon: 0, // TODO: Calculate from tournament_teams
    }));

    return NextResponse.json({ leaderboard });

  } catch (error) {
    console.error('Get players leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

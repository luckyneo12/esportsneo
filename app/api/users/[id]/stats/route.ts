import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await query<any[]>(
      'SELECT * FROM user_stats WHERE user_id = ?',
      [params.id]
    );

    if (stats.length === 0) {
      return NextResponse.json({
        matches_played: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        tournaments_participated: 0,
        tournaments_won: 0,
      });
    }

    return NextResponse.json(stats[0]);

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

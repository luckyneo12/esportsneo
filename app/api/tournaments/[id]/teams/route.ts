import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teams = await query<any[]>(
      `SELECT tt.*, t.name as team_name, t.logo as team_logo,
       tw.name as tower_name, u.name as captain_name
       FROM tournament_teams tt
       JOIN teams t ON tt.team_id = t.id
       JOIN towers tw ON t.tower_id = tw.id
       JOIN users u ON t.captain_id = u.id
       WHERE tt.tournament_id = ?
       ORDER BY tt.registered_at DESC`,
      [params.id]
    );

    return NextResponse.json(teams);

  } catch (error) {
    console.error('Get tournament teams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

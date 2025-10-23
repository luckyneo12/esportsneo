import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { teamIds } = body;

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json(
        { error: 'Team IDs are required' },
        { status: 400 }
      );
    }

    // Get tournament
    const tournaments = await query<any[]>(
      'SELECT * FROM tournaments WHERE id = ?',
      [params.id]
    );

    if (tournaments.length === 0) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    const tournament = tournaments[0];

    // Check if tournament is full
    const registeredCount = await query<any[]>(
      'SELECT COUNT(*) as count FROM tournament_teams WHERE tournament_id = ? AND status != "rejected"',
      [params.id]
    );

    if (registeredCount[0].count + teamIds.length > tournament.max_teams) {
      return NextResponse.json(
        { error: 'Tournament is full or not enough slots available' },
        { status: 400 }
      );
    }

    const registeredTeams = [];

    for (const teamId of teamIds) {
      // Check if team exists and user has permission
      const teams = await query<any[]>(
        `SELECT t.*, tw.owner_id, tw.co_leaders 
         FROM teams t
         JOIN towers tw ON t.tower_id = tw.id
         WHERE t.id = ?`,
        [teamId]
      );

      if (teams.length === 0) {
        continue;
      }

      const team = teams[0];
      const coLeaders = team.co_leaders ? JSON.parse(team.co_leaders) : [];
      const isOwner = team.owner_id === user.userId;
      const isCoLeader = coLeaders.includes(user.userId);

      if (!isOwner && !isCoLeader) {
        continue;
      }

      // Check if already registered
      const existing = await query<any[]>(
        'SELECT id FROM tournament_teams WHERE tournament_id = ? AND team_id = ?',
        [params.id, teamId]
      );

      if (existing.length > 0) {
        continue;
      }

      // Register team
      const registrationId = uuidv4();
      await query(
        `INSERT INTO tournament_teams (id, tournament_id, team_id, registered_by, status) 
         VALUES (?, ?, ?, ?, 'pending')`,
        [registrationId, params.id, teamId, user.userId]
      );

      registeredTeams.push({ id: registrationId, teamId });
    }

    return NextResponse.json({
      message: `${registeredTeams.length} team(s) registered successfully`,
      registeredTeams,
    }, { status: 201 });

  } catch (error) {
    console.error('Register teams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

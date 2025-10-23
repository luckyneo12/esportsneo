import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { saveFile, validateImageFile } from '@/lib/upload';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const towerId = searchParams.get('towerId');

    let teams;
    if (towerId) {
      teams = await query<any[]>(
        `SELECT t.*, u.name as captain_name, u.username as captain_username,
         tw.name as tower_name
         FROM teams t
         JOIN users u ON t.captain_id = u.id
         JOIN towers tw ON t.tower_id = tw.id
         WHERE t.tower_id = ?
         ORDER BY t.created_at DESC`,
        [towerId]
      );
    } else {
      teams = await query<any[]>(
        `SELECT t.*, u.name as captain_name, u.username as captain_username,
         tw.name as tower_name
         FROM teams t
         JOIN users u ON t.captain_id = u.id
         JOIN towers tw ON t.tower_id = tw.id
         ORDER BY t.created_at DESC`
      );
    }

    teams.forEach(team => {
      team.members = team.members ? JSON.parse(team.members) : [];
    });

    return NextResponse.json(teams);

  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const towerId = formData.get('towerId') as string;
    const captainId = formData.get('captainId') as string;
    const memberIds = formData.get('memberIds') as string;
    const logoFile = formData.get('logo') as File;

    if (!name || !towerId || !captainId || !logoFile) {
      return NextResponse.json(
        { error: 'Name, tower, captain, and logo are required' },
        { status: 400 }
      );
    }

    // Check tower ownership/co-leader
    const towers = await query<any[]>(
      'SELECT owner_id, co_leaders, max_teams FROM towers WHERE id = ?',
      [towerId]
    );

    if (towers.length === 0) {
      return NextResponse.json(
        { error: 'Tower not found' },
        { status: 404 }
      );
    }

    const tower = towers[0];
    const coLeaders = tower.co_leaders ? JSON.parse(tower.co_leaders) : [];
    const isOwner = tower.owner_id === user.userId;
    const isCoLeader = coLeaders.includes(user.userId);

    if (!isOwner && !isCoLeader) {
      return NextResponse.json(
        { error: 'Only tower owner or co-leader can create teams' },
        { status: 403 }
      );
    }

    // Check team name uniqueness within tower
    const existing = await query<any[]>(
      'SELECT id FROM teams WHERE name = ? AND tower_id = ?',
      [name, towerId]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Team name already exists in this tower' },
        { status: 409 }
      );
    }

    // Check max teams limit
    const teamCount = await query<any[]>(
      'SELECT COUNT(*) as count FROM teams WHERE tower_id = ?',
      [towerId]
    );
    if (teamCount[0].count >= tower.max_teams) {
      return NextResponse.json(
        { error: 'Tower has reached maximum team limit' },
        { status: 400 }
      );
    }

    // Validate logo
    const validation = validateImageFile(logoFile);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const logoPath = await saveFile(logoFile, 'teams');
    const teamId = uuidv4();

    const members = memberIds ? JSON.parse(memberIds) : [];
    
    // Ensure captain is in members
    if (!members.includes(captainId)) {
      members.push(captainId);
    }

    await query(
      `INSERT INTO teams (id, name, logo, tower_id, captain_id, members) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [teamId, name, logoPath, towerId, captainId, JSON.stringify(members)]
    );

    const teams = await query<any[]>(
      'SELECT * FROM teams WHERE id = ?',
      [teamId]
    );

    const team = teams[0];
    team.members = JSON.parse(team.members);

    return NextResponse.json(team, { status: 201 });

  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { saveFile, validateImageFile } from '@/lib/upload';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teams = await query<any[]>(
      `SELECT t.*, u.name as captain_name, u.username as captain_username,
       tw.name as tower_name, tw.owner_id as tower_owner_id
       FROM teams t
       JOIN users u ON t.captain_id = u.id
       JOIN towers tw ON t.tower_id = tw.id
       WHERE t.id = ?`,
      [params.id]
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const team = teams[0];
    team.members = team.members ? JSON.parse(team.members) : [];

    // Get member details
    if (team.members.length > 0) {
      const memberDetails = await query<any[]>(
        `SELECT id, name, username, avatar, game_id 
         FROM users 
         WHERE id IN (${team.members.map(() => '?').join(',')})`,
        team.members
      );
      team.memberDetails = memberDetails;
    } else {
      team.memberDetails = [];
    }

    return NextResponse.json(team);

  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Get team and tower info
    const teams = await query<any[]>(
      `SELECT t.*, tw.owner_id, tw.co_leaders 
       FROM teams t
       JOIN towers tw ON t.tower_id = tw.id
       WHERE t.id = ?`,
      [params.id]
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const team = teams[0];
    const coLeaders = team.co_leaders ? JSON.parse(team.co_leaders) : [];
    const isOwner = team.owner_id === user.userId;
    const isCoLeader = coLeaders.includes(user.userId);

    if (!isOwner && !isCoLeader) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const captainId = formData.get('captainId') as string;
    const memberIds = formData.get('memberIds') as string;
    const logoFile = formData.get('logo') as File | null;

    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
      const existing = await query<any[]>(
        'SELECT id FROM teams WHERE name = ? AND tower_id = ? AND id != ?',
        [name, team.tower_id, params.id]
      );
      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Team name already exists in this tower' },
          { status: 409 }
        );
      }
      updates.push('name = ?');
      values.push(name);
    }

    if (captainId) {
      updates.push('captain_id = ?');
      values.push(captainId);
    }

    if (memberIds) {
      const members = JSON.parse(memberIds);
      updates.push('members = ?');
      values.push(JSON.stringify(members));
    }

    if (logoFile && logoFile.size > 0) {
      const validation = validateImageFile(logoFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      const logoPath = await saveFile(logoFile, 'teams');
      updates.push('logo = ?');
      values.push(logoPath);
    }

    if (updates.length > 0) {
      values.push(params.id);
      await query(
        `UPDATE teams SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    const updatedTeams = await query<any[]>(
      'SELECT * FROM teams WHERE id = ?',
      [params.id]
    );

    const updatedTeam = updatedTeams[0];
    updatedTeam.members = updatedTeam.members ? JSON.parse(updatedTeam.members) : [];

    return NextResponse.json(updatedTeam);

  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const teams = await query<any[]>(
      `SELECT t.*, tw.owner_id, tw.co_leaders 
       FROM teams t
       JOIN towers tw ON t.tower_id = tw.id
       WHERE t.id = ?`,
      [params.id]
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const team = teams[0];
    const coLeaders = team.co_leaders ? JSON.parse(team.co_leaders) : [];
    const isOwner = team.owner_id === user.userId;
    const isCoLeader = coLeaders.includes(user.userId);

    if (!isOwner && !isCoLeader) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await query('DELETE FROM teams WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

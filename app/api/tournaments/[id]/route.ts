import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { saveFile, validateImageFile } from '@/lib/upload';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournaments = await query<any[]>(
      `SELECT t.*, u.name as organizer_name, u.username as organizer_username
       FROM tournaments t
       JOIN users u ON t.created_by = u.id
       WHERE t.id = ?`,
      [params.id]
    );

    if (tournaments.length === 0) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    const tournament = tournaments[0];
    tournament.map_pool = tournament.map_pool ? JSON.parse(tournament.map_pool) : [];
    tournament.allowed_tower_ids = tournament.allowed_tower_ids ? JSON.parse(tournament.allowed_tower_ids) : null;

    // Get registered teams count
    const teamCount = await query<any[]>(
      'SELECT COUNT(*) as count FROM tournament_teams WHERE tournament_id = ? AND status != "rejected"',
      [params.id]
    );
    tournament.registered_teams_count = teamCount[0].count;

    return NextResponse.json(tournament);

  } catch (error) {
    console.error('Get tournament error:', error);
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

    const tournaments = await query<any[]>(
      'SELECT created_by FROM tournaments WHERE id = ?',
      [params.id]
    );

    if (tournaments.length === 0) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    if (tournaments[0].created_by !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const updates: string[] = [];
    const values: any[] = [];

    const fields = [
      'title', 'game', 'description', 'rules', 'status',
      'maxTeams', 'entryFee', 'prizePool', 'dateTime',
      'mapPool', 'allowedTowerIds', 'roomId', 'roomPassword'
    ];

    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null) {
        const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        updates.push(`${dbField} = ?`);
        values.push(value);
      }
    }

    const bannerFile = formData.get('banner') as File | null;
    const logoFile = formData.get('logo') as File | null;

    if (bannerFile && bannerFile.size > 0) {
      const validation = validateImageFile(bannerFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      const bannerPath = await saveFile(bannerFile, 'banners');
      updates.push('banner = ?');
      values.push(bannerPath);
    }

    if (logoFile && logoFile.size > 0) {
      const validation = validateImageFile(logoFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      const logoPath = await saveFile(logoFile, 'logos');
      updates.push('logo = ?');
      values.push(logoPath);
    }

    if (updates.length > 0) {
      values.push(params.id);
      await query(
        `UPDATE tournaments SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    const updatedTournaments = await query<any[]>(
      'SELECT * FROM tournaments WHERE id = ?',
      [params.id]
    );

    const tournament = updatedTournaments[0];
    tournament.map_pool = tournament.map_pool ? JSON.parse(tournament.map_pool) : [];
    tournament.allowed_tower_ids = tournament.allowed_tower_ids ? JSON.parse(tournament.allowed_tower_ids) : null;

    return NextResponse.json(tournament);

  } catch (error) {
    console.error('Update tournament error:', error);
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

    const tournaments = await query<any[]>(
      'SELECT created_by FROM tournaments WHERE id = ?',
      [params.id]
    );

    if (tournaments.length === 0) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    if (tournaments[0].created_by !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await query('DELETE FROM tournaments WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete tournament error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

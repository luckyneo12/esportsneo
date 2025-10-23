import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { saveFile, validateImageFile } from '@/lib/upload';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const game = searchParams.get('game');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let sql = `SELECT t.*, u.name as organizer_name, u.username as organizer_username
               FROM tournaments t
               JOIN users u ON t.created_by = u.id
               WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }

    if (game) {
      sql += ' AND t.game = ?';
      params.push(game);
    }

    sql += ' ORDER BY t.date_time DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const tournaments = await query<any[]>(sql, params);

    // Parse JSON fields
    tournaments.forEach(tournament => {
      tournament.map_pool = tournament.map_pool ? JSON.parse(tournament.map_pool) : [];
      tournament.allowed_tower_ids = tournament.allowed_tower_ids ? JSON.parse(tournament.allowed_tower_ids) : null;
    });

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM tournaments WHERE 1=1';
    const countParams: any[] = [];
    
    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }
    if (game) {
      countSql += ' AND game = ?';
      countParams.push(game);
    }

    const countResult = await query<any[]>(countSql, countParams);
    const total = countResult[0].total;

    return NextResponse.json({
      data: tournaments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Get tournaments error:', error);
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

    if (user.role !== 'organiser' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only organizers can create tournaments' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const game = formData.get('game') as string;
    const description = formData.get('description') as string;
    const rules = formData.get('rules') as string;
    const status = formData.get('status') as string;
    const maxTeams = parseInt(formData.get('maxTeams') as string);
    const entryFee = parseFloat(formData.get('entryFee') as string) || 0;
    const prizePool = formData.get('prizePool') as string;
    const dateTime = formData.get('dateTime') as string;
    const mapPool = formData.get('mapPool') as string;
    const allowedTowerIds = formData.get('allowedTowerIds') as string;
    const bannerFile = formData.get('banner') as File | null;
    const logoFile = formData.get('logo') as File | null;

    if (!title || !game || !description || !maxTeams || !dateTime) {
      return NextResponse.json(
        { error: 'Title, game, description, max teams, and date/time are required' },
        { status: 400 }
      );
    }

    let bannerPath = null;
    let logoPath = null;

    if (bannerFile && bannerFile.size > 0) {
      const validation = validateImageFile(bannerFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      bannerPath = await saveFile(bannerFile, 'banners');
    }

    if (logoFile && logoFile.size > 0) {
      const validation = validateImageFile(logoFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      logoPath = await saveFile(logoFile, 'logos');
    }

    const tournamentId = uuidv4();

    await query(
      `INSERT INTO tournaments 
       (id, title, game, map_pool, description, rules, banner, logo, status, 
        max_teams, entry_fee, prize_pool, date_time, allowed_tower_ids, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tournamentId, title, game, mapPool || null, description, rules || null,
        bannerPath, logoPath, status || 'upcoming', maxTeams, entryFee,
        prizePool || null, dateTime, allowedTowerIds || null, user.userId
      ]
    );

    const tournaments = await query<any[]>(
      'SELECT * FROM tournaments WHERE id = ?',
      [tournamentId]
    );

    const tournament = tournaments[0];
    tournament.map_pool = tournament.map_pool ? JSON.parse(tournament.map_pool) : [];
    tournament.allowed_tower_ids = tournament.allowed_tower_ids ? JSON.parse(tournament.allowed_tower_ids) : null;

    return NextResponse.json(tournament, { status: 201 });

  } catch (error) {
    console.error('Create tournament error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

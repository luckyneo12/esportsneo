import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Tower code is required' },
        { status: 400 }
      );
    }

    const towers = await query<any[]>(
      'SELECT * FROM towers WHERE code = ?',
      [code.toUpperCase()]
    );

    if (towers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tower code' },
        { status: 404 }
      );
    }

    const tower = towers[0];
    tower.co_leaders = tower.co_leaders ? JSON.parse(tower.co_leaders) : [];

    return NextResponse.json({
      message: 'Tower found',
      tower: {
        id: tower.id,
        name: tower.name,
        logo: tower.logo,
      }
    });

  } catch (error) {
    console.error('Join tower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

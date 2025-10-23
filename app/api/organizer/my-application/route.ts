import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const applications = await query<any[]>(
      'SELECT * FROM organizer_applications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.userId]
    );

    if (applications.length === 0) {
      return NextResponse.json(
        { error: 'No application found' },
        { status: 404 }
      );
    }

    return NextResponse.json(applications[0]);

  } catch (error) {
    console.error('Get my application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

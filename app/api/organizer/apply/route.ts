import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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
    const { reason, experience, youtube, instagram, discord } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      );
    }

    // Check if user already has pending application
    const existing = await query<any[]>(
      'SELECT id FROM organizer_applications WHERE user_id = ? AND status = "pending"',
      [user.userId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 409 }
      );
    }

    const applicationId = uuidv4();

    await query(
      `INSERT INTO organizer_applications 
       (id, user_id, reason, experience, youtube, instagram, discord, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [applicationId, user.userId, reason, experience || null, youtube || null, instagram || null, discord || null]
    );

    const applications = await query<any[]>(
      'SELECT * FROM organizer_applications WHERE id = ?',
      [applicationId]
    );

    return NextResponse.json(applications[0], { status: 201 });

  } catch (error) {
    console.error('Apply for organizer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [total, organizers, blocked] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ORGANISER' } }),
      prisma.user.count({ where: { role: 'PLAYER' } }), // TODO: Add isBlocked field
    ]);

    return NextResponse.json({
      total,
      organizers,
      blocked: 0, // TODO: Implement blocking
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

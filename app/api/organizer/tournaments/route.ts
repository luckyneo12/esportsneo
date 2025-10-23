import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || (user.role !== 'organiser' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get tournaments organized by this user
    const tournaments = await prisma.tournament.findMany({
      where: {
        organizers: {
          some: {
            id: parseInt(user.userId)
          }
        }
      },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        matchDateTime: 'desc'
      }
    });

    return NextResponse.json(tournaments);

  } catch (error) {
    console.error('Get organizer tournaments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

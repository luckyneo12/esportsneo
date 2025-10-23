import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const registrations = await prisma.tournamentRegistration.findMany({
      where: {
        tournamentId: parseInt(id)
      },
      include: {
        team: {
          include: {
            tower: {
              select: {
                id: true,
                name: true,
              }
            },
            captain: {
              select: {
                id: true,
                name: true,
                username: true,
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(registrations);

  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

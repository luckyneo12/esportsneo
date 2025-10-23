import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);
    if (!user || (user.role !== 'organiser' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { roomId, roomPassword } = body;

    const tournament = await prisma.tournament.update({
      where: { id: parseInt(params.id) },
      data: {
        roomId,
        roomPassword,
      }
    });

    return NextResponse.json(tournament);

  } catch (error) {
    console.error('Update room details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = authenticateRequest(request);
    if (!user || (user.role !== 'organiser' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const registration = await prisma.tournamentRegistration.update({
      where: { id: parseInt(id) },
      data: {
        status,
        approvedByUserId: parseInt(user.userId),
      },
      include: {
        team: true,
        tournament: true,
      }
    });

    // TODO: Send notification to team

    return NextResponse.json(registration);

  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

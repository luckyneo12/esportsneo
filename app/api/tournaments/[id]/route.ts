import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
      include: {
        organizers: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        _count: {
          select: {
            registrations: {
              where: {
                status: { not: 'REJECTED' }
              }
            }
          }
        }
      }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...tournament,
      registered_teams_count: tournament._count.registrations
    });

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = authenticateRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions - only organizer or admin can update
    const tournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
      include: {
        organizers: {
          where: {
            id: parseInt(authUser.userId)
          }
        }
      }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    const isOrganizer = tournament.organizers.length > 0;
    const isAdmin = authUser.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    // Only update fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.game !== undefined) updateData.game = body.game;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.rules !== undefined) updateData.rules = body.rules;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.maxTeams !== undefined) updateData.maxTeams = parseInt(body.maxTeams);
    if (body.entryFee !== undefined) updateData.entryFee = parseFloat(body.entryFee);
    if (body.prizePool !== undefined) updateData.prizePool = parseFloat(body.prizePool);
    if (body.matchDateTime !== undefined) updateData.matchDateTime = new Date(body.matchDateTime);
    if (body.roomId !== undefined) updateData.roomId = body.roomId;
    if (body.roomPassword !== undefined) updateData.roomPassword = body.roomPassword;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updatedTournament = await prisma.tournament.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        organizers: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json(updatedTournament);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = authenticateRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const tournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
      include: {
        organizers: {
          where: {
            id: parseInt(authUser.userId)
          }
        }
      }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    const isOrganizer = tournament.organizers.length > 0;
    const isAdmin = authUser.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only organizer or admin can delete' },
        { status: 403 }
      );
    }

    await prisma.tournament.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete tournament error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

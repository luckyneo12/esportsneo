import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        captain: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          }
        },
        tower: {
          select: {
            id: true,
            name: true,
            leaderId: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                gameId: true,
              }
            }
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(team);

  } catch (error) {
    console.error('Get team error:', error);
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

    // Get team and check permissions
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        tower: {
          select: {
            leaderId: true,
            coLeaderId: true,
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const isOwner = team.tower.leaderId === parseInt(authUser.userId);
    const isCoLeader = team.tower.coLeaderId === parseInt(authUser.userId);

    if (!isOwner && !isCoLeader) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, captainId } = body;

    const updateData: any = {};

    if (name) {
      // Check uniqueness
      const existing = await prisma.team.findFirst({
        where: {
          name,
          towerId: team.towerId,
          id: { not: parseInt(id) }
        }
      });
      
      if (existing) {
        return NextResponse.json(
          { error: 'Team name already exists in this tower' },
          { status: 409 }
        );
      }
      updateData.name = name;
    }

    if (captainId !== undefined) {
      updateData.captainId = parseInt(captainId);
    }

    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        captain: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        tower: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json(updatedTeam);

  } catch (error) {
    console.error('Update team error:', error);
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

    // Get team and check permissions
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        tower: {
          select: {
            leaderId: true,
            coLeaderId: true,
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const isOwner = team.tower.leaderId === parseInt(authUser.userId);
    const isCoLeader = team.tower.coLeaderId === parseInt(authUser.userId);

    if (!isOwner && !isCoLeader) {
      return NextResponse.json(
        { error: 'Forbidden - Only tower owner/co-leader can delete teams' },
        { status: 403 }
      );
    }

    await prisma.team.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

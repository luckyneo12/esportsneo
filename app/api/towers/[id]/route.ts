import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tower = await prisma.tower.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
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
                level: true,
                performancePoints: true,
              }
            }
          }
        },
        teams: {
          include: {
            captain: {
              select: {
                id: true,
                name: true,
                username: true,
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
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!tower) {
      return NextResponse.json(
        { error: 'Tower not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tower);

  } catch (error) {
    console.error('Get tower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check ownership
    const tower = await prisma.tower.findUnique({
      where: { id: parseInt(params.id) },
      select: { leaderId: true, coLeaderId: true }
    });

    if (!tower) {
      return NextResponse.json(
        { error: 'Tower not found' },
        { status: 404 }
      );
    }

    const isOwner = tower.leaderId === parseInt(authUser.userId);
    const isCoLeader = tower.coLeaderId === parseInt(authUser.userId);

    if (!isOwner && !isCoLeader) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, maxTeams, maxMembers } = body;

    const updateData: any = {};

    if (name) {
      // Check uniqueness
      const existing = await prisma.tower.findFirst({
        where: {
          name,
          id: { not: parseInt(params.id) }
        }
      });
      
      if (existing) {
        return NextResponse.json(
          { error: 'Tower name already exists' },
          { status: 409 }
        );
      }
      updateData.name = name;
    }

    if (description !== undefined) updateData.description = description;
    if (maxTeams !== undefined) updateData.maxTeams = maxTeams;
    if (maxMembers !== undefined) updateData.maxMembers = maxMembers;

    const updatedTower = await prisma.tower.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          }
        }
      }
    });

    return NextResponse.json(updatedTower);

  } catch (error) {
    console.error('Update tower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tower = await prisma.tower.findUnique({
      where: { id: parseInt(params.id) },
      select: { leaderId: true }
    });

    if (!tower) {
      return NextResponse.json(
        { error: 'Tower not found' },
        { status: 404 }
      );
    }

    if (tower.leaderId !== parseInt(authUser.userId)) {
      return NextResponse.json(
        { error: 'Forbidden - Only tower owner can delete' },
        { status: 403 }
      );
    }

    await prisma.tower.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete tower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

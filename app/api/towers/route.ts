import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const towers = await prisma.tower.findMany({
      where: userId && userId !== 'undefined' ? {
        OR: [
          { leaderId: parseInt(userId) },
          { coLeaderId: parseInt(userId) }
        ]
      } : undefined,
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        },
        teams: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(towers);

  } catch (error) {
    console.error('Get towers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { name, description, maxTeams, maxMembers } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tower name is required' },
        { status: 400 }
      );
    }

    // Check name uniqueness
    const existing = await prisma.tower.findUnique({
      where: { name }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Tower name already exists' },
        { status: 409 }
      );
    }

    // Generate unique code
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const existingCode = await prisma.tower.findUnique({ where: { code } });
      if (!existingCode) isUnique = true;
    }

    // Create tower
    const tower = await prisma.tower.create({
      data: {
        name,
        code,
        description: description || null,
        leaderId: parseInt(user.userId),
        maxTeams: maxTeams || 10,
        maxMembers: maxMembers || 50,
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json(tower, { status: 201 });

  } catch (error) {
    console.error('Create tower error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

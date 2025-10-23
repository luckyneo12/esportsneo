import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        username: true,
        mobile: true,
        email: true,
        avatarUrl: true,
        bio: true,
        gameId: true,
        role: true,
        level: true,
        xp: true,
        matchesPlayed: true,
        matchesWon: true,
        kills: true,
        deaths: true,
        wins: true,
        mvpCount: true,
        performancePoints: true,
        instagramUrl: true,
        youtubeUrl: true,
        discordUrl: true,
        customTagline: true,
        createdAt: true,
        updatedAt: true,
        ledTowers: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            code: true,
          }
        },
        captainedTeams: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Get user error:', error);
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

    if (authUser.userId !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, username, bio, gameId, instagramUrl, youtubeUrl, discordUrl, customTagline } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (gameId !== undefined) updateData.gameId = gameId;
    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
    if (discordUrl !== undefined) updateData.discordUrl = discordUrl;
    if (customTagline !== undefined) updateData.customTagline = customTagline;

    if (username) {
      // Check username uniqueness
      const existing = await prisma.user.findFirst({
        where: {
          username,
          id: { not: parseInt(id) }
        }
      });
      
      if (existing) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
      updateData.username = username;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        mobile: true,
        email: true,
        avatarUrl: true,
        bio: true,
        gameId: true,
        role: true,
        instagramUrl: true,
        youtubeUrl: true,
        discordUrl: true,
        customTagline: true,
      }
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function POST(
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

    const body = await request.json();
    const { teamIds } = body;

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json(
        { error: 'Team IDs are required' },
        { status: 400 }
      );
    }

    // Get tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
      include: {
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

    // Check if tournament is full
    const currentRegistrations = tournament._count.registrations;
    if (currentRegistrations + teamIds.length > tournament.maxTeams) {
      return NextResponse.json(
        { error: 'Tournament is full or not enough slots available' },
        { status: 400 }
      );
    }

    const registeredTeams = [];

    for (const teamId of teamIds) {
      // Check if team exists and user has permission
      const team = await prisma.team.findUnique({
        where: { id: parseInt(teamId) },
        include: {
          tower: {
            select: {
              leaderId: true,
              coLeaderId: true,
            }
          }
        }
      });

      if (!team) continue;

      const isOwner = team.tower.leaderId === parseInt(authUser.userId);
      const isCoLeader = team.tower.coLeaderId === parseInt(authUser.userId);

      if (!isOwner && !isCoLeader) continue;

      // Check if already registered
      const existing = await prisma.tournamentRegistration.findFirst({
        where: {
          tournamentId: parseInt(id),
          teamId: parseInt(teamId)
        }
      });

      if (existing) continue;

      // Register team
      const registration = await prisma.tournamentRegistration.create({
        data: {
          tournamentId: parseInt(id),
          teamId: parseInt(teamId),
          createdByUserId: parseInt(authUser.userId),
          status: 'PENDING',
        }
      });

      registeredTeams.push({ id: registration.id, teamId });
    }

    return NextResponse.json({
      message: `${registeredTeams.length} team(s) registered successfully`,
      registeredTeams,
    }, { status: 201 });

  } catch (error) {
    console.error('Register teams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

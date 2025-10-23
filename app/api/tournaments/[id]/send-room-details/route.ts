import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function POST(
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

    // Get tournament with room details
    const tournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
      include: {
        registrations: {
          where: {
            status: 'APPROVED'
          },
          include: {
            team: {
              include: {
                captain: true,
                members: {
                  include: {
                    user: true
                  }
                }
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

    if (!tournament.roomId || !tournament.roomPassword) {
      return NextResponse.json(
        { error: 'Room details not set' },
        { status: 400 }
      );
    }

    // Create notifications for all approved teams
    const notifications = [];
    for (const reg of tournament.registrations) {
      // Notify captain
      if (reg.team.captain) {
        notifications.push({
          userId: reg.team.captain.id,
          type: 'ROOM_DETAILS',
          title: `Room Details - ${tournament.title}`,
          message: `Room ID: ${tournament.roomId}\nPassword: ${tournament.roomPassword}`,
          data: JSON.stringify({
            tournamentId: tournament.id,
            roomId: tournament.roomId,
            roomPassword: tournament.roomPassword,
          }),
        });
      }

      // Notify all team members
      for (const member of reg.team.members) {
        notifications.push({
          userId: member.user.id,
          type: 'ROOM_DETAILS',
          title: `Room Details - ${tournament.title}`,
          message: `Room ID: ${tournament.roomId}\nPassword: ${tournament.roomPassword}`,
          data: JSON.stringify({
            tournamentId: tournament.id,
            roomId: tournament.roomId,
            roomPassword: tournament.roomPassword,
          }),
        });
      }
    }

    // Create all notifications
    await prisma.notification.createMany({
      data: notifications as any,
    });

    return NextResponse.json({
      sent: notifications.length,
      teams: tournament.registrations.length,
    });

  } catch (error) {
    console.error('Send room details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

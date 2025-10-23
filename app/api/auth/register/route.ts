import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, mobile, password, email, gameId } = body;

    // Validation
    if (!name || !username || !mobile || !password) {
      return NextResponse.json(
        { error: 'Name, username, mobile, and password are required' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { mobile }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or mobile number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        mobile,
        email: email || null,
        password: passwordHash,
        gameId: gameId || null,
        role: 'PLAYER',
      },
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
      }
    });

    // Generate token
    const token = generateToken({ userId: user.id.toString(), role: 'player' });

    return NextResponse.json({
      user,
      token,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

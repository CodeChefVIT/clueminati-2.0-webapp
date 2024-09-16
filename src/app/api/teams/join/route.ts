import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { teams, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const SECRET_KEY = process.env.SIGNUP_KEY;

export async function POST(req: NextRequest) {
  try {
    const { teamId, userEmail, secretKey } = await req.json();

    if (!teamId || !userEmail || !secretKey) {
      return NextResponse.json(
        { error: 'Missing teamId, userEmail, or secretKey' },
        { status: 400 }
      );
    }

    if (secretKey !== SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid secretKey' },
        { status: 403 }
      );
    }

    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user[0].teamId !== null) {
      return NextResponse.json(
        { error: 'User is already part of a team' },
        { status: 400 }
      );
    }


    await db
      .update(teams)
      .set({
        userIds: sql`array_append(user_ids, ${userEmail})`,
        userCount: Number(teams.userCount) + 1,
      })
      .where(eq(teams.id, teamId));


    await db
      .update(users)
      .set({ teamId: teamId })
      .where(eq(users.email, userEmail));

    return NextResponse.json(
      { message: 'Joined team successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error joining team:', error);
    return NextResponse.json(
      { error: 'Failed to join team' },
      { status: 500 }
    );
  }
}

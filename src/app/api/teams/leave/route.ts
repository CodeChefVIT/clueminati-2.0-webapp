import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { teams, users } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
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

    if (!team.length) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(
        and(eq(users.email, userEmail), eq(users.teamId, teamId))
      )
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User is not part of this team' },
        { status: 400 }
      );
    }

    await db
      .update(teams)
      .set({
        userIds: sql`array_remove(userIds, ${userEmail})`,
        userCount: sql`userCount - 1`,
      })
      .where(eq(teams.id, teamId));

    await db
      .update(users)
      .set({ teamId: null })
      .where(eq(users.email, userEmail));

    return NextResponse.json(
      { message: 'Left team successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error leaving team:', error);
    return NextResponse.json(
      { error: 'Failed to leave team' },
      { status: 500 }
    );
  }
}

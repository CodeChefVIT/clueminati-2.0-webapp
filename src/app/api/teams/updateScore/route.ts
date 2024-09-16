import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { teams } from '@/server/db/schema';
import { sql, eq } from 'drizzle-orm';

const SECRET_KEY = process.env.SIGNUP_KEY;

export async function POST(req: NextRequest) {
  try {
    const { teamId, questionId, score, secretKey } = await req.json();

    if (!teamId || !questionId || !score || !secretKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if the question has already been solved
    if (team[0]?.solved?.includes(questionId)) {
      return NextResponse.json(
        { error: 'Question already solved by the team' },
        { status: 400 }
      );
    }

    await db
      .update(teams)
      .set({
        score: sql`${teams.score} + ${score}`,
        solved: sql`array_append(${teams.solved}, ${questionId})`,
      })
      .where(eq(teams.id, teamId));

    return NextResponse.json(
      { message: 'Score updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}

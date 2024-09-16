// src/app/api/dashboard/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/server/db';
import { teams } from '@/server/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  if (!(req.method === "GET")) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }
  
  try {
    const leaderboard = await db
      .select()
      .from(teams)
      .orderBy(desc(teams.score));

    return NextResponse.json(
      { leaderboard },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

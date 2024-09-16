import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { teams } from '@/server/db/schema';

export async function GET() {
  try {
    const allTeams = await db.select().from(teams);
    
    return NextResponse.json(
      { teams: allTeams },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

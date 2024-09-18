// src/app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { getVerfiyJWT } from "@/lib/authHeader";
import { getTiers } from "@/lib/tiers";

export async function GET() {
  const token = await getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let user;
  try {
    user = await db.query.users.findFirst({
      where: eq(users.email, token.email),
      with: {
        team: {
          columns: {
            name: true,
            score: true,
          },
        },
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  let allTeams;
  try {
    allTeams = await db
      .select({ id: teams.id, name: teams.name, score: teams.score })
      .from(teams)
      .orderBy(desc(teams.score));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  const tiers = getTiers(allTeams, user);

  return NextResponse.json(
    {
      message: "Data fetched successfully",
      data: {
        topTeams: allTeams.slice(0, 9),
        score: user.team?.score,
        currentTier: tiers.curr.toLowerCase(),
        nextTier: tiers.next.toLowerCase(),
        pointsToNextTier: (tiers.scoreToBeat ?? 0) - (user.team?.score ?? 0),
        name: user.team?.name,
      },
    },
    { status: 200 },
  );
}

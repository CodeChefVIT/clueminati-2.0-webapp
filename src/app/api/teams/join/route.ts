import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getVerfiyJWT } from "@/lib/authHeader";
import { type joinTeamProps } from "@/types/api/team";

export async function POST(req: NextRequest) {
  const token = await getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let data;
  try {
    data = (await req.json()) as joinTeamProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.teamCode || data.teamCode.length === 0) {
    return NextResponse.json(
      { message: "Team code is required" },
      { status: 400 },
    );
  }

  let user;
  try {
    [user] = await db.select().from(users).where(eq(users.email, token.email));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  } else if (user.teamId) {
    return NextResponse.json(
      { message: "User already in team" },
      { status: 409 },
    );
  }

  let team;
  try {
    [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.teamCode, data.teamCode));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  } else if (team.userCount === parseInt(process.env.MAX_TEAM_SIZE ?? "5")) {
    return NextResponse.json({ error: "Team is full" }, { status: 409 });
  } else if (team.userIds.includes(token.email)) {
    return NextResponse.json(
      { error: "User is already part of the team" },
      { status: 400 },
    );
  }

  try {
    await db
      .update(teams)
      .set({
        userIds: sql`array_append(user_ids, ${token.email})`,
        userCount: Number(team.userCount) + 1,
      })
      .where(eq(teams.teamCode, data.teamCode));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  try {
    await db
      .update(users)
      .set({ teamId: team.id })
      .where(eq(users.email, token.email));
  } catch {
    await db
      .update(teams)
      .set({
        userIds: sql`array_remove(user_ids, ${token.email})`,
        userCount: team.userCount ?? 1 - 1,
      })
      .where(eq(teams.teamCode, data.teamCode));
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Joined team successfully" },
    { status: 200 },
  );
}

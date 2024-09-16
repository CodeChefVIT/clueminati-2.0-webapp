import { getVerfiyJWT } from "@/lib/authHeader";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE() {
  const token = getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
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
  } else if (!user.teamId) {
    return NextResponse.json(
      { message: "User is not part of a team" },
      { status: 400 },
    );
  }

  let team;
  try {
    [team] = await db.select().from(teams).where(eq(teams.id, user.teamId));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  } else if (!team.userIds.includes(token.email)) {
    return NextResponse.json(
      { error: "User is not part of this team" },
      { status: 400 },
    );
  }

  try {
    await db
      .update(users)
      .set({ teamId: null })
      .where(eq(users.email, token.email));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  try {
    if (team.userIds.length === 1) {
      await db.delete(teams).where(eq(teams.id, user.teamId));
    } else {
      await db
        .update(teams)
        .set({
          userIds: sql`array_remove(userIds, ${token.email})`,
          userCount: sql`userCount - 1`,
        })
        .where(eq(teams.id, user.teamId));
    }
  } catch {
    await db
      .update(users)
      .set({ teamId: team.id })
      .where(eq(users.email, token.email));
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message:
        team.userIds.length === 1
          ? "Left and deleted team succelfully"
          : "Left team successfully",
    },
    { status: 200 },
  );
}

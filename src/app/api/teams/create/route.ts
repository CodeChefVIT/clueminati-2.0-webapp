import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm/expressions";
import { getVerfiyJWT } from "@/lib/authHeader";
import { getTeamCode } from "@/utils/teamCode";
import { type PostgresError } from "postgres";
import { type createTeamProps } from "@/types/api/team";

export async function POST(req: NextRequest) {
  const token = getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let data;
  try {
    data = (await req.json()) as createTeamProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.teamName || data.teamName.length === 0) {
    return NextResponse.json(
      { message: "Team name is required" },
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
    const teamCode = getTeamCode();

    const [exists] = await db
      .select()
      .from(teams)
      .where(eq(teams.teamCode, teamCode));

    if (exists) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 },
      );
    }

    [team] = await db
      .insert(teams)
      .values({
        name: data.teamName,
        teamCode: teamCode,
        userCount: 1,
        userIds: [token.email],
        score: 0,
      })
      .returning();
  } catch (e) {
    if (e instanceof Error && e.name === "PostgresError") {
      const err = e as PostgresError;
      if (err.code === "23505") {
        return NextResponse.json(
          { message: "Team name already exists" },
          { status: 409 },
        );
      } else if (err.code === "23502") {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
      }
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!team) {
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
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Team created successfully",
      data: {
        name: team.name,
        teamCode: team.teamCode,
      },
    },
    { status: 201 },
  );
}

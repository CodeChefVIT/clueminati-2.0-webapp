import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { sql, eq } from "drizzle-orm";
import { type updateScoreProps } from "@/types/api/auth";
import { getVerfiyJWT } from "@/lib/authHeader";

export async function POST(req: NextRequest) {
  const token = await getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  if (token.role !== "admin") {
    return NextResponse.json({ message: "Sneaky mfker!" }, { status: 403 });
  }

  let data;
  try {
    data = (await req.json()) as updateScoreProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.teamCode || !data.questionId || !data.points || !data.key) {
    return NextResponse.json(
      { message: "Team Code, Quetion Id and points are required" },
      { status: 400 },
    );
  }

  if (data.key !== process.env.SCOREBOARD_KEY) {
    return NextResponse.json({ message: "Sneaky mfker!" }, { status: 403 });
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
    return NextResponse.json({ message: "Team not found" }, { status: 404 });
  } else if (team.solved?.includes(data.questionId)) {
    return NextResponse.json(
      { message: "Question already solved" },
      { status: 400 },
    );
  }

  try {
    await db
      .update(teams)
      .set({
        score: sql`${teams.score} + ${data.points}`,
        solved: sql`array_append(solved, ${data.questionId})`,
      })
      .where(eq(teams.teamCode, data.teamCode));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Score updated successfully" },
    { status: 200 },
  );
}

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
    // Use a transaction to ensure data consistency
    await db.transaction(async (trx) => {
      [team] = await trx
        .select()
        .from(teams)
        .where(eq(teams.teamCode, data.teamCode));

      if (!team) {
        throw new Error("Team not found");
      }

      if (team.solved?.includes(data.questionId)) {
        throw new Error("Question already solved");
      }

      await trx
        .update(teams)
        .set({
          score: sql`${teams.score} + ${data.points}`,
          solved: sql`array_append(solved, ${data.questionId})`,
        })
        .where(eq(teams.teamCode, data.teamCode));
    },{
      isolationLevel: "serializable",
    });
  } catch (e) {
    const error = e as Error;
    if (error.message === "Team not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error.message === "Question already solved") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
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

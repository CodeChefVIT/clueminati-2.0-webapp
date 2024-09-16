import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { getVerfiyJWT } from "@/lib/authHeader";
import { eq } from "drizzle-orm";
import { type PostgresError } from "postgres";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  if (!params.id) {
    return NextResponse.json(
      { message: "Team id is required" },
      { status: 400 },
    );
  }

  let team;
  try {
    team = await db.query.teams.findFirst({
      where: eq(teams.id, params.id),
      with: {
        users: {
          columns: { name: true, email: true },
        },
      },
      columns: { name: true, teamCode: true, score: true },
    });
  } catch (e) {
    if (e instanceof Error && e.name === "PostgresError") {
      const err = e as PostgresError;
      if (err.code === "22P02") {
        return NextResponse.json(
          { message: "Invalid team id" },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!team) {
    return NextResponse.json({ message: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Team fetched successfully", data: team },
    { status: 200 },
  );
}

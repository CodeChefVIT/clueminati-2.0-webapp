import { getVerfiyJWT } from "@/lib/authHeader";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { type startHuntProps } from "@/types/api/team";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (process.env.STARTED === "true") {
    return NextResponse.json(
      { message: "The hunt has begun!" },
      { status: 403 },
    );
  }
  
  const token = await getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  if (token.role !== "admin") {
    return NextResponse.json({ message: "Sneaky mfker!" }, { status: 403 });
  }

  let data;
  try {
    data = (await req.json()) as startHuntProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.key) {
    return NextResponse.json({ message: "Key is required" }, { status: 400 });
  }

  if (data.key !== process.env.START_KEY) {
    return NextResponse.json({ message: "Sneaky mfker!" }, { status: 403 });
  }

  try {
    const allTeams = await db.select().from(teams);
    let i = 0;
    for (const team of allTeams) {
      await db
        .update(teams)
        .set({ station: i % 7 })
        .where(eq(teams.teamCode, team.teamCode));
      i++;
    }
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  process.env.STARTED = "true";
  return NextResponse.json({ message: "Hunt started" });
}

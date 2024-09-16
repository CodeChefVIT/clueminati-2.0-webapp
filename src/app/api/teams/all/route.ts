import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { getVerfiyJWT } from "@/lib/authHeader";

export async function GET() {
  const token = getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  if (token.role !== "admin") {
    return NextResponse.json(
      { message: "Sneaky mfker!" },
      { status: 403 },
    );
  }
  
  try {
    const allTeams = await db
      .select({ name: teams.name, code: teams.teamCode })
      .from(teams);

    return NextResponse.json(
      { message: "Teams fetched successfully", data: allTeams },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

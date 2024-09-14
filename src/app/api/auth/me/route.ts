import { getVerfiyJWT } from "@/lib/authHeader";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const email = getVerfiyJWT();
  if (!email) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let user;
  let team = null;
  try {
    [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.teamId) {
      [team] = await db
        .select({ name: teams.name })
        .from(teams)
        .where(eq(teams.id, user.teamId));
    }
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Data fetched successfully",
      data: {
        name: user.name,
        email: user.email,
        team: team,
      },
    },
    { status: 200 },
  );
}

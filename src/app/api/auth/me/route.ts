import { getVerfiyJWT } from "@/lib/authHeader";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let user;
  try {
    user = await db.query.users.findFirst({
      columns: { name: true, email: true, teamId: true },
      with: {
        team: {
          with: {
            users: {
              columns: { name: true, email: true },
            },
          },
          columns: {
            name: true,
            teamCode: true,
            userCount: true,
            score: true,
          },
        },
      },
      where: eq(users.email, token.email),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
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
      data: user,
    },
    { status: 200 },
  );
}

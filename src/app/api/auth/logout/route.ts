import { getVerfiyJWT } from "@/lib/authHeader";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  const email = getVerfiyJWT();
  if (!email) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  try {
    await db.delete(sessions).where(eq(sessions.userId, email));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}

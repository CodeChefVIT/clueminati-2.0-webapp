import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { comparePassword } from "@/utils/bcrypt";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
interface loginProps {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  if (!(req.method === "POST")) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  const data = (await req.json()) as loginProps;

  if (!data.email || !data.password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  let user;
  try {
    [user] = await db.select().from(users).where(eq(users.email, data.email));
  } catch {
    return NextResponse.json(
      { message: "An error occurred while fetching user" },
      { status: 500 },
    );
  }

  if (!user) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 400 },
    );
  }

  if (!comparePassword(data.password, user.password)) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { message: "Login success", data: user },
    { status: 200 },
  );
}

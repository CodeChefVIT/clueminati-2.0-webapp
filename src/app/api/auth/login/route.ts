import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { comparePassword } from "@/utils/bcrypt";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { generateJWT } from "@/utils/jwt";

interface loginProps {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  let data;
  try {
    data = (await req.json()) as loginProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.email || !data.password) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 400 },
    );
  }

  let user;
  try {
    [user] = await db.select().from(users).where(eq(users.email, data.email));
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!user || !comparePassword(data.password, user.password)) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 400 },
    );
  }

  const token = generateJWT(user.email, user.role);
  try {
    await db
      .insert(sessions)
      .values({ token, userId: user.email })
      .onConflictDoUpdate({ target: [sessions.userId], set: { token } });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Login success",
      data: {
        name: user?.name,
        email: user?.email,
        teamId: user?.teamId,
        token: token,
      },
    },
    { status: 200 },
  );
}

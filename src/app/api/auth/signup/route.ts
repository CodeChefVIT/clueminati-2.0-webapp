import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { hashPassword } from "@/utils/bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import { PostgresError } from "postgres";

interface signupProps {
  name: string;
  email: string;
  password: string;
  key: string;
}

export async function POST(req: NextRequest) {
  if (!(req.method === "POST")) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  const data = (await req.json()) as signupProps;

  if (!data.email || !data.password || !data.name || !data.key) {
    return NextResponse.json(
      { message: "Email, password and name are required" },
      { status: 400 },
    );
  }

  if (data.key !== process.env.SIGNUP_KEY) {
    return NextResponse.json({ message: "Sneaky mfker!" }, { status: 403 });
  }

  let user;

  try {
    const hashedPassword = hashPassword(data.password);
    [user] = await db
      .insert(users)
      .values({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      })
      .returning();
  } catch (e) {
    if (e instanceof PostgresError) {
      if (e.code === "23505") {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409 },
        );
      } else if (e.code === "23502") {
        return NextResponse.json(
          { message: "Email, password and name are required" },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Signup success", data: user },
    { status: 201 },
  );
}

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { type signupProps } from "@/types/api/auth";
import { hashPassword } from "@/utils/bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import { type PostgresError } from "postgres";

export async function POST(req: NextRequest) {
  let data;
  try {
    data = (await req.json()) as signupProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.email || !data.password || !data.name || !data.key) {
    return NextResponse.json(
      { message: "Email, password and name are required" },
      { status: 400 },
    );
  }

  try {
    const hashedPassword = hashPassword(data.password);
    await db.insert(users).values({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: "admin",
    });
  } catch (e) {
    if (e instanceof Error && e.name === "PostgresError") {
      const err = e as PostgresError;
      if (err.code === "23505") {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409 },
        );
      } else if (err.code === "23502") {
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

  return NextResponse.json({ message: "Signup success" }, { status: 201 });
}

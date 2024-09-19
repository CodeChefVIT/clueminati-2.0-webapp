import { getVerfiyJWT } from "@/lib/authHeader";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { type updateProps } from "@/types/api/auth";
import { hashPassword } from "@/utils/bcrypt";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const token = await getVerfiyJWT();
  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  let data;
  try {
    data = (await req.json()) as updateProps;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!data.name && !data.password) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  if (data.password?.length === 0) {
    return NextResponse.json(
      { message: "Password cannot be blank" },
      { status: 400 },
    );
  }
  if (data.name?.length === 0) {
    return NextResponse.json(
      { message: "Name cannot be blank" },
      { status: 400 },
    );
  }

  let user;
  try {
    const hashedPassword = data.password && hashPassword(data.password);
    await db
      .update(users)
      .set({ name: data.name, password: hashedPassword })
      .where(eq(users.email, token.email));

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
  } catch {
    NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "User updated succesfully", data: user },
    { status: 200 },
  );
}

import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { verifyJWT } from "@/utils/jwt";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getVerfiyJWT() {
  let email;
  let role;
  try {
    const authHeader = headers().get("Authorization");
    if (!authHeader) {
      throw new Error("No Authorization header found");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("No token found");
    }

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token));

    if (!session) {
      throw new Error("No session found");
    }

    const payload = verifyJWT(token);
    if (
      typeof payload !== "string" &&
      Object.keys(payload).includes("email") &&
      Object.keys(payload).includes("role")
    ) {
      email = payload.email as string;
      role = payload.role as string;
    } else {
      throw new Error("Invalid payload");
    }

    if (session.userId !== email) {
      throw new Error("Email does not match");
    }
  } catch {
    return false;
  }

  return { email, role };
}

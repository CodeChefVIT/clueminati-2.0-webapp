import { verifyJWT } from "@/utils/jwt";
import { headers } from "next/headers";

export function getVerfiyJWT() {
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
  } catch {
    return false;
  }

  return { email, role };
}

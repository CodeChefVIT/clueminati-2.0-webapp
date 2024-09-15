import jwt from "jsonwebtoken";

export function generateJWT(email: string, role: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not found in .env");
  }
  return jwt.sign({ email, role }, secret, {
    expiresIn: "1h",
  });
}

export function verifyJWT(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not found in .env");
  }
  return jwt.verify(token, secret);
}

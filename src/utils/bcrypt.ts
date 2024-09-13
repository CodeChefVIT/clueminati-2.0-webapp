import bcrypt from "bcrypt";

export function hashPassword(password: string) {
  const hashed = bcrypt.hashSync(password, 10);
  return hashed;
}

export function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

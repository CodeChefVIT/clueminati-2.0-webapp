import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { hashPassword } from "@/utils/bcrypt";
import { generatePassword } from "@/utils/password";
import { type NextRequest, NextResponse } from "next/server";
import { jsonToCSV, readString } from "react-papaparse";

export async function POST(req: NextRequest) {
  let data;
  try {
    data = await req.formData();
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  const key = data.get("key");
  if (!key || key !== process.env.SIGNUP_KEY) {
    return NextResponse.json({ message: "Sneaky mfker!" }, { status: 403 });
  }

  const file = data.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  let parsed;
  try {
    const text = await file.text();
    readString(text, {
      encoding: "utf8",
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        parsed = res;
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  if (!parsed) {
    return NextResponse.json({ message: "Invalid CSV" }, { status: 400 });
  } else if (!(parsed as { data?: [] }).data) {
    return NextResponse.json({ message: "No data found" }, { status: 400 });
  }

  for (const row of (parsed as { data: [] }).data) {
    const entry = row as { Email: string; Name: string; Password?: string };
    if (!entry.Email || !entry.Name) {
      continue;
    }
    const password = generatePassword();
    try {
      const hashedPassword = hashPassword(password);
      await db.insert(users).values({
        email: entry.Email,
        password: hashedPassword,
        name: entry.Name,
      });
      entry.Password = password;
    } catch {
      continue;
    }
  }

  const newFile = jsonToCSV((parsed as { data: [] }).data);

  return new NextResponse(newFile, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="users.csv"`,
    },
  });
}

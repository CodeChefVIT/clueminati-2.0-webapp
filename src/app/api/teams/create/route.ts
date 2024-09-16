import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm/expressions";
import { getVerfiyJWT } from "@/lib/authHeader";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json(); // need teamProps
		const { teamName, teamCode, secretKey } = body;
		
		if (secretKey !== process.env.SIGNUP_KEY) {
			return NextResponse.json({ message: "Forbidden: Invalid secret key" }, { status: 403 });
		}
		
		const existingTeam = await db
		.select()
		.from(teams)
		.where(eq(teams.teamCode, teamCode))
		.limit(1);
		
		if (existingTeam.length > 0) {
			return NextResponse.json({ message: "Team with this code already exists" }, { status: 400 });
		}
		const email: string = getVerfiyJWT() || "no-email";

		// const userAlreadyInTeam = await db
		// .select()
		// .from(teams)
		// .where(inArray(teams.userIds, email)) // error
		// .limit(1)

		if (userAlreadyInTeam) {
			return NextResponse.json({ message: "Error creating team", error: "User already in team" }, { status: 500 });
		}

		const newTeam = await db.insert(teams).values({
			name: teamName,
			teamCode: teamCode,
			userCount: 1,
			userIds: [email],
			score: 0,
		}).returning();
		
		return NextResponse.json({ message: "Team created successfully", team: newTeam }, { status: 201 });
	} catch (error) {
		console.error("Error creating team:", error);
		return NextResponse.json({ message: "Error creating team", error: error.message }, { status: 500 });
	}
}

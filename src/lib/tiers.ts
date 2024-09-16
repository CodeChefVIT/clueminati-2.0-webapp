import { type users } from "@/server/db/schema";

const tiers = [
  { name: "Diamond", start: 1, end: 20 },
  { name: "Gold", start: 21, end: 40 },
  { name: "Silver", start: 41, end: 60 },
  { name: "Bronze", start: 61, end: Number.MAX_SAFE_INTEGER },
];

export function getTiers(
  allTeams: {
    id: string;
    name: string;
    score: number | null;
  }[],
  user: typeof users.$inferSelect,
) {
  const index = allTeams.findIndex((team) => team.id === user.teamId) + 1;

  const curr =
    tiers.find((tier) => index >= tier.start && index <= tier.end)?.name ??
    "Bronze";

  let scoreToBeat;
  let next = "";
  switch (curr) {
    case "Bronze":
      next = "Silver";
      scoreToBeat = allTeams[59]?.score;
      break;
    case "Silver":
      next = "Gold";
      scoreToBeat = allTeams[39]?.score;
      break;
    case "Gold":
      next = "Diamond";
      scoreToBeat = allTeams[19]?.score;
      break;
    case "Diamond":
      break;
  }

  return { curr, next, scoreToBeat };
}

export interface dashboardData {
  score: number;
  currentTier: "diamond" | "gold" | "silver" | "bronze";
  nextTier: "diamond" | "gold" | "silver";
  pointsToNextTier: number;
  topTeams: { name: string }[];
  name: string | undefined;
}

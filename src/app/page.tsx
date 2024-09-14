import Leaderboard from "./leaderboard";
import Blank from "./blank";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gray-100">

      <Blank />
      <Leaderboard />
    </main>
  );
}

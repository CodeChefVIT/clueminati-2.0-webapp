"use client";
import { useState } from "react";
import Leaderboard from "../components/leaderboard";
import Blank from "../components/dashboard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <main className="relative min-h-screen bg-gray-100">
      <Blank />
      <Leaderboard show={showLeaderboard} toggleLeaderboard={toggleLeaderboard} />
      <div className="fixed bottom-0 w-full bg-gray-800 p-4 flex justify-center">
        <Button
          onClick={toggleLeaderboard}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
          {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
        </Button>
      </div>
    </main>
  );
}

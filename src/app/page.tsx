"use client";
import { useState } from "react";
import Leaderboard from "@/components/leaderboard";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/dashboard";

export default function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <main className="relative min-h-screen bg-gray-100">
      <Dashboard/>
      <Leaderboard show={showLeaderboard} toggleLeaderboard={toggleLeaderboard} />
      <div className="fixed bottom-0 w-full bg-gray-800 p-4 flex justify-center">
        <Button
          onClick={toggleLeaderboard}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-customBlue">
          {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
        </Button>
      </div>
    </main>
  );
}

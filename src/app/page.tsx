"use client";
import { useState } from "react";
import Leaderboard from "./leaderboard";
import Blank from "./blank";

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
        <button
          onClick={toggleLeaderboard}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
          {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
        </button>
      </div>
    </main>
  );
}

"use client";
import Dashboard from "@/components/dashboard";
import Leaderboard from "@/components/leaderboard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="relative min-h-screen bg-gray-100">
      <Dashboard />
      <Leaderboard
        show={showLeaderboard}
        toggleLeaderboard={toggleLeaderboard}
      />
      <div className="fixed bottom-0 flex w-full justify-center bg-gray-800 p-4">
        <Button
          onClick={toggleLeaderboard}
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-customBlue"
        >
          {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
        </Button>
      </div>
    </main>
  );
}

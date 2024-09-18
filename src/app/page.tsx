"use client";
import Dashboard from "@/components/dashboard";
import Leaderboard from "@/components/leaderboard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { type dashboardData } from "@/types/client/dashboard";
import { errorToast } from "@/utils/errors";
import axios, { type AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<dashboardData>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get<{ data: dashboardData }>(
          "/api/teams/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const temp = response.data.data;
        temp.topTeams.push({ name: temp.name ?? "" });
        if (!temp.name) {
          setTimeout(() => {
            router.push("/team");
          }, 2000);
        }
        setLeaderboardData(temp);
      } catch (e) {
        const err = e as AxiosError;
        if (err.status === 401) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
        errorToast(e);
      }
    };

    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
    getData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [router]);

  if (loading || !leaderboardData) {
    return <Loading />;
  }

  return (
    <main className="relative min-h-screen bg-gray-100">
      <Dashboard leaderboardData={leaderboardData} />
      <Leaderboard
        leaderboardData={leaderboardData}
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

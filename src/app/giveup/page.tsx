"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { type Team, type TeamsApiResponse } from "@/types/client/updatescore";
import { useRouter } from "next/navigation";

const questionIds = [
  ...Array.from({ length: 30 }, (_, i) => `easy${i + 1}`), // Easy: easy1 to easy30
  ...Array.from({ length: 17 }, (_, i) => `medium${i + 1}`), // Medium: medium1 to medium17
  ...Array.from({ length: 17 }, (_, i) => `tough${i + 1}`), // Tough: tough1 to tough17

  ...Array.from({ length: 7 }, (_, i) => `set1_${i + 1}`), // Set 1: set1_1 to set1_7
  ...Array.from({ length: 6 }, (_, i) => `set2_${i + 1}`), // Set 2: set2_1 to set2_6
];

export default function UpdateScorePage() {
    const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamCode, setSelectedTeamCode] = useState<string>("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    questionIds[0] ?? "",
  );
  const [points, setPoints] = useState<number>(0);
  const [adminKey, setAdminKey] = useState<string>("");


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<TeamsApiResponse>("/api/teams/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data.data);
      } catch {
        toast.error("Failed to fetch teams");
        router.push("/login");
      }
    };

    void fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTeamCode || !selectedQuestionId || points < 0 || !adminKey) {
      toast.error("Please fill in all fields.");
      return;
    }

    const updateData = {
      teamCode: selectedTeamCode,
      questionId: selectedQuestionId,
      points: points,
      key: adminKey,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/teams/update-score", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Score updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Question is already solved by the team");
        } else {
          toast.error("Failed to update score");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Award Points to Teams</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="team"
            className="block text-sm font-medium text-gray-700"
          >
            Select Team
          </label>
          <select
            id="team"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-600"
            value={selectedTeamCode}
            onChange={(e) => setSelectedTeamCode(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.code} value={team.code}>
                {team.name} (Code: {team.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="questionId"
            className="block text-sm font-medium text-gray-700"
          >
            Select Question
          </label>
          <select
            id="questionId"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-600"
            value={selectedQuestionId}
            onChange={(e) => setSelectedQuestionId(e.target.value)}
            required
          >
            {questionIds.map((qid) => (
              <option key={qid} value={qid}>
                {qid}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700"
          >
            Award Points
          </label>
          <input
            id="points"
            type="number"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-600"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            placeholder="Enter points to award"
            required
            min={0}
          />
        </div>

        <div>
          <label
            htmlFor="adminKey"
            className="block text-sm font-medium text-gray-700"
          >
            Admin Key
          </label>
          <input
            id="adminKey"
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-600"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-600"
        >
          Update Score
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

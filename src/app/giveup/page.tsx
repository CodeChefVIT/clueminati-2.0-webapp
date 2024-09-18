"use client";

import { type Team, type TeamsApiResponse } from "@/types/client/updatescore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const questionIds = [
  // Station 1, 2, 3: 10 easy questions each
  ...Array.from({ length: 10 }, (_, i) => `station1_easy${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `station2_easy${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `station3_easy${i + 1}`),

  // Station 4: 8 medium questions
  ...Array.from({ length: 8 }, (_, i) => `station4_medium${i + 1}`),

  // Station 5: 9 medium questions
  ...Array.from({ length: 9 }, (_, i) => `station5_medium${i + 1}`),

  // Station 6: 8 tough questions
  ...Array.from({ length: 8 }, (_, i) => `station6_tough${i + 1}`),

  // Station 7: 9 tough questions
  ...Array.from({ length: 9 }, (_, i) => `station7_tough${i + 1}`),
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
      <h1 className="mb-6 text-2xl font-semibold">Award Points to Teams</h1>

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
    </div>
  );
}

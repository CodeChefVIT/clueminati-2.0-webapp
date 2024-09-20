"use client";

import { cn } from "@/lib/utils";
import { type Team, type TeamsApiResponse } from "@/types/client/updatescore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const questionIds = [
  "Secret Station",
  "Final Station",
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
  const [loading, setLoading] = useState(false);

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

  function getPoints(questionId: string) {
    if (questionId.includes("easy")) return 10;
    if (questionId.includes("medium")) return 15;
    if (questionId.includes("tough")) return 20;
    if (questionId.includes("Secret") || questionId.includes("Final"))
      return 100;
    return 0; // default points if none of the conditions match
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!selectedTeamCode || !selectedQuestionId || points < 0) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const updateData = {
      teamCode: selectedTeamCode,
      questionId: selectedQuestionId,
      points: getPoints(selectedQuestionId),
      key: "skill-issue-bastards",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/teams/update-score", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Chill Bro! success it is bwahaha");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Kya skill issue hora bhay? pehele hee ho gya hai");
        } else {
          toast.error("ye bhi meri galti hai??");
        }
      } else {
        toast.error("An unknown error occurred. This is genuine");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-8 p-8">
      <h1 className="mb-2 text-center text-2xl font-semibold">
        Award Points to Teams
      </h1>
      <h1 className="text-md mb-2 text-center font-semibold">
        Dont feel too powerful
      </h1>
      <h1 className="mb-6 text-center text-sm font-semibold">
        You are still a JC -_-
      </h1>

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
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={selectedTeamCode}
            onChange={(e) => setSelectedTeamCode(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            {teams
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort teams alphabetically by name
              .map((team) => (
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
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
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
          <div
            id="questionId"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
          >
            {selectedQuestionId.includes("easy") && "10"}
            {selectedQuestionId.includes("medium") && "15"}
            {selectedQuestionId.includes("tough") && "20"}
            {selectedQuestionId.includes("Secret") && "100"}
            {selectedQuestionId.includes("Final") && "100"}
          </div>
        </div>

        {/* <div>
          <label
            htmlFor="adminKey"
            className="block text-sm font-medium text-gray-700"
          >
            Admin Key
          </label>
          <input
            id="adminKey"
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            required
          />
        </div> */}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full rounded-lg bg-customGreen p-3 text-black",
            loading && "bg-gray-600 text-white",
          )}
        >
          {loading ? "ruko bhay..." : "Update Score"}
        </button>
        <Link href={"/"}>
          <button className="mt-4 w-full rounded-lg bg-customBlue p-3 text-black">
            Get me the fuck out of this
          </button>
        </Link>
      </form>
    </div>
  );
}

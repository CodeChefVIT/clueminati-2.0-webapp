"use client";

import Loading from "@/components/Loading";
import { createTeamAPIProps } from "@/types/api/team";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TeamLookup() {
  const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");
  const [teamCode, setTeamCode] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
    setLoading(false);
  }, [router]);

  const CreateTeam = async () => {
    try {
      const { data }: { data: createTeamAPIProps } = await axios.post(
        "/api/teams/create",
        {
          teamName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(data.message);
      localStorage.setItem("team", data.data.teamCode);
      router.push("/team/created");
    } catch (e) {
      const err = e as AxiosError;
      console.log(err);
      toast.error("Something went wrong");
      console.log(e);
    }
  };

  const JoinTeam = async () => {
    try {
      const response = await axios.post(
        "/api/teams/join",
        {
          teamCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Team joined successfully");
      router.push("/");
    } catch (e) {
      const err = e as AxiosError;
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isCreatingTeam) {
      await CreateTeam();
      console.log("Creating a new team");
      setIsLoading(false);
    } else {
      await JoinTeam();
      console.log("Joining an existing");
    }
    setIsLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div className="mt-8 w-full max-w-md rounded-lg bg-white p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold leading-7">
          Team Formation
        </h1>

        <div className="mb-6 flex flex-col items-center">
          <span className="mb-2 text-sm font-normal">Create a New Team?</span>
          <div className="flex items-center">
            <span className="mr-4 text-lg">
              {isCreatingTeam ? "  Yes" : "  No"}
            </span>
            <label className="inline-flex cursor-pointer items-center">
              <div
                className={`relative inline-flex h-5 w-10 items-center rounded-full border ${
                  isCreatingTeam ? "bg-[#AEF276]" : "bg-[#88DBF9]"
                }`}
                onClick={() => {
                  setIsCreatingTeam(!isCreatingTeam);
                  console.log(isCreatingTeam);
                }}
              >
                <div
                  className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white transition-transform ${
                    isCreatingTeam ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>
          <div className="mt-2 text-center text-sm font-normal text-gray-400">
            {isCreatingTeam
              ? "Team Leader makes the New Team"
              : "Join an Existing Team"}
          </div>
        </div>

        {isCreatingTeam ? (
          <div className="mb-4">
            <label
              htmlFor="teamName"
              className="text-sm font-semibold text-gray-700"
            >
              Team Name
            </label>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team name"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label
              htmlFor="teamCode"
              className="text-sm font-semibold text-gray-700"
            >
              Join a team
            </label>
            <p className="mb-2 text-sm text-gray-500">
              Enter the code from your team to join them!
            </p>
            <input
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              className="w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team code"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full rounded-lg py-2 font-medium ${
            isCreatingTeam
              ? "bg-[#AEF276] text-black hover:bg-green-700"
              : "bg-[#88DBF9] text-black hover:bg-blue-700"
          } mt-4`}
        >
          {isLoading
            ? "Loading..."
            : isCreatingTeam
              ? "Create Team"
              : "Join Team"}
        </button>
      </div>
    </div>
  );
}

"use client";

import Loading from "@/components/Loading";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { type createTeamAPIProps } from "@/types/api/team";
import { errorToast } from "@/utils/errors";
import axios, { type AxiosError } from "axios";
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
    if (teamName.length < 3) {
      toast.error("Team name must be atleast 3 characters long");
      return;
    } else if (teamName.length > 20) {
      toast.error("Team name must be less than 20 characters long");
      return;
    } else if (!/^[a-zA-Z0-9_ ]*$/.test(teamName)) {
      toast.error("Team name can only contain alphabets, numbers and spaces");
      return;
    }
    try {
      const { data }: { data: createTeamAPIProps } = await axios.post(
        "/api/teams/create",
        { teamName },
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
      if (err.status === 401) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      errorToast(e);
    }
  };

  const JoinTeam = async () => {
    try {
      await axios.post(
        "/api/teams/join",
        { teamCode: teamCode.toUpperCase() },
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
      if (err.status === 401) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      errorToast(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    if (isCreatingTeam) {
      await CreateTeam();
      setIsLoading(false);
    } else {
      await JoinTeam();
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
            <Switch
              checked={isCreatingTeam}
              onCheckedChange={() => setIsCreatingTeam((prev) => !prev)}
            />
          </div>
          <div className="mt-2 text-center text-sm font-normal tracking-wider text-gray-400">
            {isCreatingTeam
              ? "Team Leader makes the New Team"
              : "Join an Existing Team"}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isCreatingTeam ? (
            <div className="mb-4">
              <label
                htmlFor="teamName"
                className="text-sm font-semibold tracking-wider text-gray-700"
              >
                Team Name
              </label>
              <input
                value={teamName}
                required
                onChange={(e) => setTeamName(e.target.value)}
                className="h-[50px] w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter team name"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label
                htmlFor="teamCode"
                className="text-sm font-semibold tracking-wider text-gray-700"
              >
                Join a team
              </label>
              {/* <p className="mb-2 text-sm text-gray-500">
                Enter the code from your team to join them!
              </p> */}
              <input
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                required
                maxLength={6}
                minLength={6}
                className="h-[50px] w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter team code"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              `text-md h-[50px] w-full rounded-lg px-3 font-medium text-black ${
                isCreatingTeam
                  ? "bg-customGreen text-black"
                  : "bg-customBlue text-black"
              } mt-4`,
              isLoading && "text-gray-700",
              !isLoading && "transition-all duration-300 active:scale-[0.97]",
            )}
          >
            {isLoading
              ? "Loading..."
              : isCreatingTeam
                ? "Create Team"
                : "Join Team"}
          </button>
        </form>
      </div>
    </div>
  );
}

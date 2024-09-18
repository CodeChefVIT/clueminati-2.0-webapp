"use client";

import Loading from "@/components/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  teamName: z.string().min(1, { message: "Team name is required" }).trim(),
  teamCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TeamLookup() {
  const [loading, setLoading] = useState(true);
  const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsLoading(true);

    try {
      if (isCreatingTeam) {
        const response = await axios.post(
          "/api/teams/create",
          {
            teamName: data.teamName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 201) {
          const { message, data: teamData } = response.data;
          localStorage.setItem("team", teamData.teamCode);
          toast.success(message);
          setTimeout(() => {
            router.push("/team/created");
          }, 500);
        } else {
          toast.error("Unexpected response status");
        }
      } else {
        if (!data.teamCode) {
          toast.error("Team code is required");
          return;
        }

        const response = await axios.post(
          "/api/teams/join",
          {
            teamCode: data.teamCode,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          toast.success("Successfully joined the team!");
        } else {
          toast.error("Unexpected response status");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 w-full max-w-md rounded-lg bg-white p-8"
      >
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
                onClick={() => setIsCreatingTeam((prevState) => !prevState)}
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
          <>
            <div className="mb-4">
              <label
                htmlFor="teamName"
                className="text-sm font-semibold text-gray-700"
              >
                Team Name
              </label>
              <input
                {...register("teamName")}
                className="w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter team name"
              />
              {errors.teamName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.teamName.message}
                </p>
              )}
            </div>
          </>
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
              {...register("teamCode")}
              className="w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team code"
            />
            {errors.teamCode && (
              <p className="mt-1 text-xs text-red-500">
                {errors.teamCode.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
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
      </form>
    </div>
  );
}

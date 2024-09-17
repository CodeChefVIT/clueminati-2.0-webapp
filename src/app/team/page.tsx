"use client"; // <-- This makes the component a Client Component

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw, Share2 } from "lucide-react"; // Import Lucide icons
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

// Generate a random alphanumeric team code
function generateTeamCode(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Zod schema for validation
const schema = z.object({
  teamName: z.string().min(1, { message: "Team name is required" }).trim(),
  teamCode: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Team code must be alphanumeric" })
    .length(5, { message: "Team code must be 5 characters long" }),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [teamCode, setTeamCode] = useState<string>(generateTeamCode());
  const [isTeamCreated, setIsTeamCreated] = useState<boolean>(true); // Toggle state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form submitted with data:", data); // Debugging log

    if (isTeamCreated) {
      // Notify team creation
      toast.success(
        `Team Created! Name: ${data.teamName}, Code: ${data.teamCode}`,
      );
    } else {
      // Notify team joining
      toast.success(`You have joined the team with code: ${data.teamCode}`);
    }
  };

  const handleCopyToClipboard = () => {
    void navigator.clipboard.writeText(teamCode);
    toast.success("Team code copied to clipboard!");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg bg-white p-6"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
          {isTeamCreated ? "Team Formation" : "Join an Existing Team"}
        </h1>

        {/* Create New Team Toggle */}
        <div className="mb-6 flex items-center justify-center">
          <label className="inline-flex cursor-pointer items-center">
            <span className="mr-3 text-sm text-gray-700">
              {isTeamCreated
                ? "Team Leader makes a new team"
                : "Join an existing team"}
            </span>
            <div
              className={`relative inline-flex cursor-pointer items-center ${
                isTeamCreated ? "bg-green-500" : "bg-gray-200"
              } h-6 w-12 rounded-full transition-colors`}
              onClick={() => setIsTeamCreated((prevState) => !prevState)}
            >
              <div
                className={`absolute left-0 top-0 h-6 w-6 rounded-full bg-white transition-transform ${
                  isTeamCreated ? "translate-x-6" : ""
                }`}
              />
              <div
                className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center transition-transform ${
                  isTeamCreated ? "translate-x-6" : ""
                }`}
              >
                {isTeamCreated ? (
                  <span className="text-xs text-green-600">✓</span>
                ) : (
                  <span className="text-xs text-red-600">✗</span>
                )}
              </div>
            </div>
          </label>
        </div>

        {/* Conditionally render forms based on toggle */}
        {isTeamCreated ? (
          <>
            {/* Team Name */}
            <div className="mb-6">
              <input
                {...register("teamName")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter team name"
              />
              {errors.teamName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.teamName.message}
                </p>
              )}
            </div>

            {/* Team Code */}
            <div className="mb-6">
              <div className="mb-2 text-gray-600">
                Your teammates can use this code to join you!
              </div>
              <div className="flex items-center">
                <input
                  {...register("teamCode")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Team code"
                  value={teamCode}
                  readOnly
                />
                <div className="ml-2 flex space-x-2">
                  <button
                    type="button"
                    className="flex items-center justify-center rounded bg-gray-200 p-2 hover:bg-gray-300"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="text-lg text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded bg-gray-200 p-2 hover:bg-gray-300"
                    onClick={() => setTeamCode(generateTeamCode())}
                  >
                    <RefreshCw className="text-lg text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded bg-gray-200 p-2 hover:bg-gray-300"
                  >
                    <Share2 className="text-lg text-gray-600" />
                  </button>
                </div>
              </div>
              {errors.teamCode && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.teamCode.message}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="mb-6">
            <input
              {...register("teamCode")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team code"
            />
            {errors.teamCode && (
              <p className="mt-1 text-sm text-red-500">
                {errors.teamCode.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600"
        >
          {isTeamCreated ? "Create team" : "Join team"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

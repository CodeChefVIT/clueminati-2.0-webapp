"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const schema = z.object({
  teamName: z.string().min(1, { message: "Team name is required" }).trim(),
  teamCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TeamLookup() {
  const [teamCode, setTeamCode] = useState<string | null>(null); 
  const [teamName, setTeamName] = useState<string | null>(null);
  const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      if (isCreatingTeam) {
        // Creating a new team
        const response = await axios.post('/api/teams/create', {
          teamName: data.teamName,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.status === 201) {
          const { message, data: teamData } = response.data;
          setTeamName(teamData.name);
          setTeamCode(teamData.teamCode); 
          toast.success(message);
        } else {
          toast.error('Unexpected response status');
        }
      } else {
        // Joining an existing team
        if (!data.teamCode) {
          toast.error('Team code is required');
          return;
        }

        const response = await axios.post('/api/teams/join', {
          teamCode: data.teamCode,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          toast.success('Successfully joined the team!');
        } else {
          toast.error('Unexpected response status');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleCopyToClipboard = () => {
    if (teamCode) {
      navigator.clipboard.writeText(teamCode);
      toast.success("Team code copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg w-full max-w-md mt-16"
      >
        <h1 className="text-center mb-6 text-2xl font-bold leading-7">
          Team Formation
        </h1>

        <div className="flex flex-col items-center mb-6">
          <span className="text-sm font-normal mb-2">Create a New Team?</span>
          <div className="flex items-center">
            <span className="mr-4 text-lg">{isCreatingTeam ? "  Yes" : "  No"}</span>
            <label className="inline-flex items-center cursor-pointer">
              <div
                className={`relative inline-flex items-center w-10 h-5 rounded-full border ${
                  isCreatingTeam ? "bg-[#AEF276]" : "bg-[#88DBF9]"
                }`}
                onClick={() => setIsCreatingTeam(prevState => !prevState)}
              >
                <div
                  className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full transition-transform ${
                    isCreatingTeam ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>
          <div className="mt-2 text-gray-400 text-sm font-normal text-center">
            {isCreatingTeam
              ? "Team Leader makes the New Team"
              : "Join an Existing Team"}
          </div>
        </div>

        {isCreatingTeam ? (
          <>
            <div className="mb-4">
              <label htmlFor="teamName" className="font-semibold text-sm text-gray-700">
                Team Name
              </label>
              <input
                {...register("teamName")}
                className="w-full px-4 py-2 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter team name"
              />
              {errors.teamName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.teamName.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="teamCode" className="font-semibold text-sm text-gray-700">
                Team Code
              </label>
              <p className="text-gray-600 text-sm mb-2">
                Your teammates can use this code to join you!
              </p>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Team code"
                  value={teamCode || ""}
                  readOnly
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="text-gray-600 text-lg" />
                </button>
              </div>
              {errors.teamCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.teamCode.message}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="mb-4">
            <label htmlFor="teamCode" className="font-semibold text-sm text-gray-700">
              Join a team
            </label>
            <p className="text-gray-500 text-sm mb-2">
              Enter the code from your team to join them!
            </p>
            <input
              {...register("teamCode")}
              className="w-full px-4 py-2 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team code"
            />
            {errors.teamCode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.teamCode.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold ${
            isCreatingTeam
              ? "bg-[#AEF276] text-black hover:bg-green-700"
              : "bg-[#88DBF9] text-black hover:bg-blue-700"
          } mt-4`}
        >
          {isCreatingTeam ? "Create Team" : "Join Team"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

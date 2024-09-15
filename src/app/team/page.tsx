"use client"; // <-- This makes the component a Client Component

import { useState } from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, RefreshCw, Share2 } from 'lucide-react'; // Import Lucide icons
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.success(`Team Created! Name: ${data.teamName}, Code: ${data.teamCode}`);
    } else {
      // Notify team joining
      toast.success(`You have joined the team with code: ${data.teamCode}`);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(teamCode);
    toast.success('Team code copied to clipboard!');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isTeamCreated ? 'Team Formation' : 'Join an Existing Team'}
        </h1>

        {/* Create New Team Toggle */}
        <div className="flex justify-center mb-6 items-center">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-3 text-gray-700 text-sm">
              {isTeamCreated ? 'Team Leader makes a new team' : 'Join an existing team'}
            </span>
            <div
              className={`relative inline-flex items-center cursor-pointer ${
                isTeamCreated ? 'bg-green-500' : 'bg-gray-200'
              } rounded-full w-12 h-6 transition-colors`}
              onClick={() => setIsTeamCreated((prevState) => !prevState)}
            >
              <div
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform ${
                  isTeamCreated ? 'translate-x-6' : ''
                }`}
              />
              <div
                className={`absolute left-0 top-0 w-6 h-6 flex items-center justify-center transition-transform ${
                  isTeamCreated ? 'translate-x-6' : ''
                }`}
              >
                {isTeamCreated ? (
                  <span className="text-green-600 text-xs">✓</span>
                ) : (
                  <span className="text-red-600 text-xs">✗</span>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter team name"
              />
              {errors.teamName && (
                <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>
              )}
            </div>

            {/* Team Code */}
            <div className="mb-6">
              <div className="mb-2 text-gray-600">Your teammates can use this code to join you!</div>
              <div className="flex items-center">
                <input
                  {...register("teamCode")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Team code"
                  value={teamCode}
                  readOnly
                />
                <div className="flex ml-2 space-x-2">
                  <button
                    type="button"
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="text-gray-600 text-lg" />
                  </button>
                  <button
                    type="button"
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                    onClick={() => setTeamCode(generateTeamCode())}
                  >
                    <RefreshCw className="text-gray-600 text-lg" />
                  </button>
                  <button
                    type="button"
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                  >
                    <Share2 className="text-gray-600 text-lg" />
                  </button>
                </div>
              </div>
              {errors.teamCode && <p className="text-red-500 text-sm mt-1">{errors.teamCode.message}</p>}
            </div>
          </>
        ) : (
          <div className="mb-6">
            <input
              {...register("teamCode")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team code"
            />
            {errors.teamCode && <p className="text-red-500 text-sm mt-1">{errors.teamCode.message}</p>}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          {isTeamCreated ? 'Create team' : 'Join team'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

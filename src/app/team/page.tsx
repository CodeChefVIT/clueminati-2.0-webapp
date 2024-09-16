"use client"; // <-- This makes the component a Client Component

import { useState } from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react'; // Import Lucide icons
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
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg w-full max-w-md mt-16 " style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
        {/* Static Heading */}
        <h1
          className="text-center mb-6"
          style={{
            fontSize: '24px',
            fontWeight: '700',
            lineHeight: '29.05px',
            textAlign: 'center',
          }}
        >
          Team Formation
        </h1>
        
        {/* Create New Team Toggle */}
        <div className="flex flex-col items-center mb-6">
          <span
            className="text-lg font-semibold mb-2"
            style={{
              fontSize: '16px',
              fontWeight: '400',
              lineHeight: '19.36px',
              textAlign: 'left',
            }}
          >
            Create a new team?
          </span>
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <div
                className={`relative inline-flex items-center cursor-pointer w-10 h-5 rounded-full border border-gray-300 ${
                  isTeamCreated ? 'bg-[#AEF276]' : 'bg-gray-200'
                }`}
                onClick={() => setIsTeamCreated((prevState) => !prevState)}
              >
                <div
                  className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full transition-transform ${
                    isTeamCreated ? 'translate-x-5' : ''
                  }`}
                />
              </div>
            </label>
            <span className="ml-4 text-lg">
              {isTeamCreated ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="mt-2">
            <span
              className="text-gray-500"
              style={{
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '16.94px',
                textAlign: 'center',
              }}
            >
              {isTeamCreated ? 'Team Leader makes the New Team' : 'Join an Existing Team'}
            </span>
          </div>
        </div>

        {/* Conditionally render forms based on toggle */}
        {isTeamCreated ? (
          <>
            {/* Team Name */}
            <div className="mb-4">
              <label htmlFor="teamName" className="font-semibold text-gray-700 text-sm">Team Name</label>
              <input
                {...register("teamName")}
                className="w-full px-4 py-2 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter team name"
              />
              {errors.teamName && (
                <p className="text-red-500 text-xs mt-1">{errors.teamName.message}</p>
              )}
            </div>

            {/* Team Code */}
            <div className="mb-4">
              <label htmlFor="teamCode" className="font-semibold text-gray-700 text-sm">Team Code</label>
              <p className="text-gray-600 text-sm mb-2" style={{ fontSize: '14px', fontWeight: '300', lineHeight: '16.94px', textAlign: 'left' }}>
                Your teammates can use this code to join you!
              </p>
              <div className="relative">
                <input
                  {...register("teamCode")}
                  className="w-full px-4 py-2 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Team code"
                  value={teamCode}
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
              {errors.teamCode && <p className="text-red-500 text-xs mt-1">{errors.teamCode.message}</p>}
            </div>
          </>
        ) : (
          <div className="mb-4">
            <label htmlFor="teamCode" className="font-semibold text-gray-700 text-sm">Join a team</label>
            <p className="text-gray-500 text-sm mb-2" style={{ fontSize: '14px', fontWeight: '300', lineHeight: '16.94px', textAlign: 'left' }}>
              Enter the code from your team to join them!
            </p>
            <input
              {...register("teamCode")}
              className="w-full px-4 py-2 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter team code"
            />
            {errors.teamCode && <p className="text-red-500 text-xs mt-1">{errors.teamCode.message}</p>}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold ${
            isTeamCreated ? 'bg-[#AEF276] text-black hover:bg-green-700' : 'bg-[#88DBF9] text-black hover:bg-blue-700'
          }`}
        >
          {isTeamCreated ? 'Create Team' : 'Join Team'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

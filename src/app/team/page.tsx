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
});

type FormData = z.infer<typeof schema>;

export default function TeamLookup() {
  const [teamCode, setTeamCode] = useState<string | null>(null); 
  const [teamName, setTeamName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      
      const token = localStorage.getItem('authToken');

      // Check if token exists
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await axios.post('/api/auth/create', {
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
      void navigator.clipboard.writeText(teamCode);
      toast.success("Team code copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg w-full max-w-md mt-16"
      >
        {/* Static Heading */}
        <h1 className="text-center mb-6 text-2xl font-bold leading-7">
          Team Code Lookup
        </h1>

        {/* Team Name Input */}
        <div className="mb-4">
          <label htmlFor="teamName" className="font-semibold text-sm text-gray-700">Team Name</label>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg font-semibold bg-[#88DBF9] text-black hover:bg-blue-700"
        >
          Lookup Team Code
        </button>

        {/* Conditionally render Team Code section */}
        {teamCode && (
          <div className="mt-6">
            <label htmlFor="teamCode" className="font-semibold text-sm text-gray-700">Team Code</label>
            <p className="text-gray-600 text-sm mb-2">
              Your team code:
            </p>
            <div className="relative">
              <input
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
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}

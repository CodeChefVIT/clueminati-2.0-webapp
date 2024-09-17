"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { type UserData, type ApiResponse } from "@/types/client/profile";


function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<ApiResponse>("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
        setName(response.data.data.name);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError("Failed to fetch user data");
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUserData();
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name && !password) {
      setError("Please provide either name or password.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const updateData: { name?: string; password?: string } = {};
      if (name) updateData.name = name;
      if (password) updateData.password = password;

      const response = await axios.patch<ApiResponse>(
        "/api/auth/update",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(response.data.message);
      setUser(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setError("Invalid data");
        } else if (error.response?.status === 401) {
          setError("Not logged in");
        } else if (error.response?.status === 500) {
          setError("Something went wrong");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">User Info</h1>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {success && (
            <div className="mb-4 text-center text-green-500">{success}</div>
          )}
          {error && (
            <div className="mb-4 text-center text-red-500">{error}</div>
          )}

          <form onSubmit={handleUpdate} className="mt-6">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 w-full rounded border p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Update name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 w-full rounded border p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Update password"
              />
            </div>

            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>

          {user.team ? (
            <div className="mt-6">
              <h2 className="mb-2 text-xl font-semibold">Team Info</h2>
              <p>
                <strong>Team Name:</strong> {user.team.name}
              </p>
              <p>
                <strong>Team Code:</strong> {user.team.teamCode}
              </p>
              <p>
                <strong>User Count:</strong> {user.team.userCount}
              </p>
              <p>
                <strong>Score:</strong> {user.team.score}
              </p>

              <h3 className="mt-4 text-lg font-medium">Team Members</h3>
              <ul className="list-disc pl-5">
                {user.team.users.map((member, index) => (
                  <li key={index}>
                    {member.name} ({member.email})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No team assigned</p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">No user data available</p>
      )}
    </div>
  );
}

export default ProfilePage;

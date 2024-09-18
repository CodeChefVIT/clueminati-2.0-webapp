"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { type ApiResponse, type UserData } from "@/types/client/profile";
import axios from "axios";
import { ChevronLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
          toast.error("Failed to fetch user data");
          setTimeout(() => {
            void router.push("/login");
          }, 2000);
        } else {
          toast.error("Unknown error occurred while fetching user data");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUserData();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name && !password) {
      toast.error("Please provide either name or password.");
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

      toast.success(response.data.message);
      setUser(response.data.data);
      setTimeout(() => {
        void router.push("/");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Invalid data");
        } else if (error.response?.status === 401) {
          toast.error("Not logged in");
          setTimeout(() => {
            void router.push("/login");
          }, 2000);
        } else if (error.response?.status === 500) {
          toast.error("Something went wrong");
        } else if (error.response?.status === 429) {
          toast.error("Too many requests. Try again in 10 minutes.");
        }
      } else {
        toast.error("Unknown error occurred while updating profile");
      }
    }
  };

  const handleLeaveTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete<ApiResponse>("/api/teams/leave", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message);
      setTimeout(() => {
        void router.push("/team");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Not logged in");
          setTimeout(() => {
            void router.push("/login");
          }, 2000);
        } else if (error.response?.status === 500) {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Unknown error occurred while leaving team");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <Button size="icon" variant="ghost" onClick={() => void router.push("/")}>
        <ChevronLeft />
      </Button>
      {user ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-semibold">User Info</h1>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <form onSubmit={handleUpdate} className="mt-6">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-black"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Update name"
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-black"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Update password"
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={name === user.name && !password}
              className="mt-4 w-full rounded-lg bg-pink-400 p-3 text-lg font-semibold text-white hover:bg-[#FBB3C0] focus:outline-none focus:ring-2 focus:ring-pink-600"
            >
              Update Profile
            </Button>
          </form>

          {user.team ? (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="mb-2 text-xl font-semibold">Team Info</h2>
                <Button size="icon" variant="ghost" onClick={handleLeaveTeam}>
                  <LogOut />
                </Button>
              </div>
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
};

export default ProfilePage;

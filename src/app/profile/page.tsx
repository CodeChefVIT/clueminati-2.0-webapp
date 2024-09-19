"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ApiResponse, type UserData } from "@/types/client/profile";
import { copyToClipboard } from "@/utils/copyToClipboard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  ChevronLeft,
  Copy,
  Eye,
  EyeOff,
  Mail,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type DecodedToken = {
  email: string;
  role: string;
  iat: number;
  exp: number;
};

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          if (decodedToken.role === "admin") {
            setAdmin(true);
          }
        }
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
      setPending(false);
      return;
    } else if (password && password.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }
    setPending(true);

    try {
      const token = localStorage.getItem("token");

      const updateData: { name?: string; password?: string } = {};
      if (name) updateData.name = name.trim();
      if (password) updateData.password = password.trim();

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
          // toast.error("Not logged in");
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
    setPending(false);
  };

  const handleLeaveTeam = async () => {
    setPending(true);
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
          // toast.error("Not logged in");
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
    setPending(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => void router.push("/")}
        >
          <ChevronLeft />
        </Button>
        {admin && (
          <Button
            size="icon"
            onClick={() => void router.push("/giveup")}
            className="w-min px-3 py-2"
            variant={"outline"}
          >
            <Users size={16} className="mr-2" /> click or gay
          </Button>
        )}
      </div>
      {user ? (
        <div className="rounded-lg bg-white p-6">
          <div className="overflow-hidden rounded-3xl bg-customYellow p-6">
            <h1 className="mb-4 text-2xl font-semibold">User Info</h1>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <strong>
                  <User />
                </strong>{" "}
                {user.name}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <strong>
                  <Mail />
                </strong>
                <span className="max-w-full overflow-hidden truncate text-ellipsis">
                  {user.email}
                </span>
              </div>
            </div>
          </div>

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

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-[50px] w-full rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="text-black" />
                ) : (
                  <Eye className="text-black" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className={cn(
                "text-md mt-6 h-[50px] w-full rounded-lg bg-customBlue px-3 font-medium text-black",
                (name === user.name.trim() && !password.trim()) || pending
                  ? "bg-gray-500 text-white"
                  : "transition-all duration-300 active:scale-[0.97]",
              )}
              disabled={
                (name === user.name.trim() && !password.trim()) || pending
              }
            >
              Update Profile
            </button>
          </form>

          {user.team ? (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="mb-2 text-xl font-semibold">Team Info</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleLeaveTeam}
                  disabled={pending}
                  className="w-fit rounded-md bg-red-500 px-2 py-1 text-white"
                >
                  Leave Team
                </Button>
              </div>
              <p>
                <strong>Team Name:</strong> {user.team.name}
              </p>
              <p className="flex flex-row items-center gap-2">
                <strong>Team Code:</strong> {user.team.teamCode}{" "}
                <span>
                  <Copy
                    onClick={() => copyToClipboard(user.team!.teamCode)}
                    size={16}
                  />
                </span>
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
                  <li key={index} className="ml-2 font-medium">
                    {member.name}
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

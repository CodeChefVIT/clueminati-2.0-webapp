"use client";
import { cn } from "@/lib/utils";
import { type LoginResponse } from "@/types/api/auth";
import { errorToast } from "@/utils/errors";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

// Validation schema using Zod for login
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(50, { message: "Email address too long" })
    .regex(/@vitstudent.ac.in$/, {
      message: "Only VIT student email addresses are allowed",
    }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
});

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formErrors = result.error.format();
      if (formErrors.email?._errors[0]) {
        toast.error(formErrors.email._errors[0]);
      }
      if (formErrors.password?._errors[0]) {
        toast.error(formErrors.password._errors[0]);
      }
      setLoading(false);
      return;
    }

    try {
      const { data }: { data: LoginResponse } = await axios.post(
        "/api/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
        },
      );
      toast.success("Login successful!");
      localStorage.setItem("token", data.data.token);
      if (data.data.teamId) {
        router.push("/");
      } else {
        router.push("/team");
      }
    } catch (e) {
      errorToast(e);
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="mt-8 flex h-screen flex-col items-center bg-white p-4">
      <main
        className="w-full max-w-md rounded-lg bg-white p-6"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>

        <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-semibold tracking-wider text-black"
            >
              Enter VIT Mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="VIT email ID"
              className="h-[50px] w-full rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-semibold tracking-wider text-black"
            >
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="h-[50px] w-full rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mx-1 flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-thin tracking-wider text-black"
            >
              We’ve sent your login credentials on your registered email
            </label>
          </div>

          <button
            type="submit"
            className={cn(
              "text-md h-[50px] w-full rounded-lg bg-[#FBB3C0] px-3 font-medium text-black focus:outline-none focus:ring-2",
              loading && "text-gray-700",
              !loading && "transition-all duration-300 active:scale-[0.97]",
            )}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
}

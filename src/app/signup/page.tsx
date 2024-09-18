"use client";
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
  const [name, setName] = useState<string>("");
  const router = useRouter();

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      return;
    }

    try {
      const { data } = await axios.post("/api/auth/signup", {
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
        key: "clueminati-2.0-web",
      });
      toast.success("ONG no way you have an account!");
      router.push("/login");
    } catch (e) {
      errorToast(e);
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <main
        className="w-full max-w-md rounded-lg bg-white p-6"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <h1 className="mb-6 text-center text-2xl font-semibold">Sign up</h1>

        <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-sm font-semibold text-black"
            >
              Enter Name
            </label>
            <input
              id="name"
              type="name"
              placeholder="Name"
              className="h-[50px] w-full rounded-lg border border-gray-300 bg-gray-200 px-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-semibold text-black"
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

          <div className="mb-4 flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-semibold text-black"
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

          <button
            type="submit"
            className="h-[50px] w-full rounded-lg bg-[#FBB3C0] px-3 text-lg font-semibold text-black hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
          >
            Sign up
          </button>
        </form>
      </main>
    </div>
  );
}

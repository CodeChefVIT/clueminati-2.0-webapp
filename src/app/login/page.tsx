"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file for Toastify
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formErrors = result.error.format();
      if (formErrors.email?._errors[0]) {
        toast.error(formErrors.email._errors[0]); // Show email error toast
      }
      if (formErrors.password?._errors[0]) {
        toast.error(formErrors.password._errors[0]); // Show password error toast
      }
      return; // Exit on error
    }

    // If validation passes
    toast.success("Login successful!"); // Show success toast
    console.log("Login Successful", { email, password });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <main className="w-[375px] rounded-lg bg-transparent p-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          Login
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* VIT Mail Input */}
          <div>
            <label htmlFor="email" className="text-sm font-bold text-black">
              Enter VIT Mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="VIT email ID"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="text-sm font-bold text-black">
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-1 text-xs font-bold text-gray-500">
              We&apos;ve sent your login credentials to your registered email.
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-[#FBB3C0] p-3 text-lg font-semibold text-white hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
          >
            Login
          </button>
        </form>
      </main>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

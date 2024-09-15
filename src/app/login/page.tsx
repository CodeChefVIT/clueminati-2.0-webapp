"use client";

import { useState } from "react";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS file for Toastify

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
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
        toast.error(formErrors.email._errors[0]);  // Show email error toast
      }
      if (formErrors.password?._errors[0]) {
        toast.error(formErrors.password._errors[0]);  // Show password error toast
      }
      return;  // Exit on error
    }

    // If validation passes
    toast.success("Login successful!");  // Show success toast
    console.log("Login Successful", { email, password });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4 relative">
      <main className="w-[375px] bg-transparent p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Login</h1>
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
              className="w-full p-3 mt-1 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full p-3 mt-1 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs font-bold text-gray-500 mt-1">
              We've sent your login credentials to your registered email.
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full p-3 mt-4 text-lg font-semibold text-white rounded-lg bg-[#FBB3C0] hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
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

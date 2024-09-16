"use client";

import { useState } from "react";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS file for Toastify

// Validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-4">
      <main className="w-full max-w-md bg-white p-6 rounded-lg mt-[-50px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 
          className="text-2xl font-bold text-center mb-6 text-black"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          Login
        </h1>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* VIT Mail Input */}
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="text-sm font-semibold text-black mb-1">
              Enter VIT Mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="VIT email ID"
              className="w-full h-[50px] px-3 text-lg bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="text-sm font-semibold text-black mb-1">
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full h-[50px] px-3 text-lg bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs font text-gray-500 mt-1">
              We've sent your login credentials to your registered email.
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-[50px] px-3 text-lg font-semibold text-black rounded-lg bg-[#FBB3C0] hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
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

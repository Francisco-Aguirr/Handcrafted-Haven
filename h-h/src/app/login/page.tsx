"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateForm = () => {
    const newErrors: { username: string; password: string } = {
      username: "",
      password: "",
    };

    if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    alert("Login clicked!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none transition 
              ${errors.username ? "border-red-500" : "border-gray-300"} 
              focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none transition 
              ${errors.password ? "border-red-500" : "border-gray-300"} 
              focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Click here to register
          </Link>
        </p>
      </div>
    </div>
  );
}


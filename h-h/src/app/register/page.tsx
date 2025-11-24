"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    passwordMatch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Validación: Contraseña coincide
    if (e.target.name === "confirm" || e.target.name === "password") {
      if (
        (e.target.name === "confirm" && e.target.value !== form.password) ||
        (e.target.name === "password" && form.confirm !== e.target.value)
      ) {
        setErrors({ passwordMatch: "Passwords do not match." });
      } else {
        setErrors({ passwordMatch: "" });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.passwordMatch) {
      alert("Fix form errors first.");
      return;
    }

    alert("Register submitted!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />

            {errors.passwordMatch && (
              <p className="text-red-600 text-sm mt-1">
                {errors.passwordMatch}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
          >
            Register
          </button>

          {/* Login link */}
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


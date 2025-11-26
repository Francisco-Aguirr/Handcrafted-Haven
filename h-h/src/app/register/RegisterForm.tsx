"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { registerUserAction, type RegisterResult } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const initialState: RegisterResult = {
  success: false,
  errors: {},
};

export default function RegisterForm() {
  const router = useRouter();

  const [state, dispatch, isPending] = useActionState(
    registerUserAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/login");
    }
  }, [state.success, router]);

  return (
    <form action={dispatch} className="space-y-4">
      {/* FIRST NAME */}
      <div>
        <label className="block mb-1 font-medium">First Name</label>
        <input
          name="firstName"
          type="text"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
        />
        {state.errors.firstName && (
          <p className="text-red-600 text-sm mt-1">{state.errors.firstName}</p>
        )}
      </div>

      {/* LAST NAME */}
      <div>
        <label className="block mb-1 font-medium">Last Name</label>
        <input
          name="lastName"
          type="text"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
        />
        {state.errors.lastName && (
          <p className="text-red-600 text-sm mt-1">{state.errors.lastName}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
        />
        {state.errors.email && (
          <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
        />
        {state.errors.password && (
          <p className="text-red-600 text-sm mt-1">{state.errors.password}</p>
        )}
      </div>

      {/* CONFIRM */}
      <div>
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          name="confirm"
          type="password"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
        />
        {state.errors.confirm && (
          <p className="text-red-600 text-sm mt-1">{state.errors.confirm}</p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <input
          name="phone"
          type="tel"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
        />
        {state.errors.phone && (
          <p className="text-red-600 text-sm mt-1">{state.errors.phone}</p>
        )}
      </div>

      {/* GENERAL ERROR */}
      {state.errors._general && (
        <p className="text-red-600 text-sm">{state.errors._general}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
      >
        {isPending ? "Registering..." : "Register"}
      </button>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-semibold">
          Login here
        </Link>
      </p>
    </form>
  );
}

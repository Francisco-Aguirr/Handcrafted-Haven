"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
      >
        Login
      </button>
    </form>
  );
}

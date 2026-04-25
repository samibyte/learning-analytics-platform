"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"instructor" | "student">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError(
          "Registered successfully, but auto-login failed. Please log in.",
        );
        router.push("/login");
      } else {
        router.push(
          role === "instructor"
            ? "/instructor/dashboard"
            : "/student/dashboard",
        );
        router.refresh();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F0A1A]">
      <div className="w-full max-w-md text-center mb-8">
        <p className="text-sm font-medium text-slate-400 mb-2">Join Us</p>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Create an account
        </h2>
        <p className="text-sm text-slate-400">
          Enter your details below to get started.
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-[#151025] px-6 py-8 sm:px-10 border border-slate-800/60 rounded-2xl shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/30 text-rose-400 p-3 rounded-md text-sm border border-red-800/50">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email here"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-300"
              >
                I am a...
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "instructor" | "student")
                  }
                  className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all appearance-none"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#151025] transition-all disabled:opacity-50"
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-fuchsia-500 hover:text-fuchsia-400 pb-1 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

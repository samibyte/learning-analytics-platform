"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "instructor") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F0A1A]">
      <div className="w-full max-w-md text-center mb-8">
        <p className="text-sm font-medium text-slate-400 mb-2">Welcome Back</p>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Sign In your account
        </h2>
        <p className="text-sm text-slate-400">
          Please enter your details to sign in.
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
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
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
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 bg-[#1A142B] text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember Me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-fuchsia-500 hover:text-fuchsia-400 transition-colors">
                  Forgot Password
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#151025] transition-all disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-fuchsia-500 hover:text-fuchsia-400 pb-1 transition-colors">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

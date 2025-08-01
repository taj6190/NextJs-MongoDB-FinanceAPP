// app/login/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-950 px-2">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="32"
                height="32"
                rx="8"
                fill="#2563eb"
              />
              <path
                d="M10 22C10 18 16 18 16 14C16 12 14 10 12 10C10 10 8 12 8 14"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 10C22 14 16 14 16 18C16 20 18 22 20 22C22 22 24 20 24 18"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-blue-700 dark:text-white">
            Sign in to FinTracker
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              className="h-11 px-4 text-base"
              placeholder="you@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              className="h-11 px-4 text-base"
              placeholder="Your password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        {/* <div className="text-center text-sm text-muted-foreground mt-2">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </a>
        </div> */}
        <div className="text-center text-sm text-muted-foreground mt-2">
          Don’t have an account? Please contact the admin at <a href="mailto:taj_y@outlook.com" className="underline">taj_y@outlook.com</a>.
        </div>
      </div>
    </div>
  );
}

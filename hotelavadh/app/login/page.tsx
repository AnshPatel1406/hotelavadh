"use client"; // Marks this file as a Client Component in Next.js.
// Needed because:

// button click
// browser interaction
// signIn function

// all run on client side.
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/rooms",
    });

    setLoading(false);

    if (!res?.ok) {
      setErr("Invalid email or password");
      return;
    }

    window.location.href = res.url || "/rooms";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full border rounded-lg p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err ? <p className="text-sm text-red-600">{err}</p> : null}

          <button
            className="w-full rounded-lg p-2 border"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login with Credentials"}
          </button>
        </form>

        <p className="text-sm">
          Not logged in?{" "}
          <Link className="underline" href="/signup">
            Signup first
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          className="w-full rounded-lg p-2 border"
          onClick={() => signIn("google", { callbackUrl: "/rooms" })}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
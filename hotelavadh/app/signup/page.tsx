"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data?.message || "Signup failed");
      return;
    }

    setMsg("Signup done. Now login.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Signup</h1>

        <form onSubmit={handleSignup} className="space-y-3">
          <input className="w-full border rounded-lg p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border rounded-lg p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded-lg p-2" placeholder="Password (min 6)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="w-full rounded-lg p-2 border" type="submit">
            Create Account
          </button>
        </form>

        {msg ? <p className="text-sm">{msg}</p> : null}

        <p className="text-sm">
          Already have an account? <Link className="underline" href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
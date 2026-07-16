"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 6;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setSuccess(false);
      setMsg(data?.message || "Signup failed");
      return;
    }

    setSuccess(true);
    setMsg("Account created successfully. You can now log in.");
  }

  return (
    <div className="grid overflow-hidden rounded-2xl border bg-card shadow-sm md:min-h-[640px] md:grid-cols-2">
      {/* ── Left / Brand Panel ── */}
      <div className="relative hidden overflow-hidden md:flex md:flex-col md:justify-between">
        <Image
          src="/homepage_images/Gemini_Avadh.png"
          alt="Hotel Avadh"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1712] via-[#1C1712]/70 to-[#1C1712]/20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(184,134,11,0.25)_0%,transparent_55%)]" />

        <div className="relative z-10 flex items-center gap-3 p-8">
          <Image
            src="/logo.png"
            alt="Hotel Avadh logo"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-white/30"
          />
          <span className="font-serif text-lg tracking-wide text-white">
            Hotel Avadh
          </span>
        </div>

        <div className="relative z-10 space-y-4 p-8">
          <span className="gold-rule" />
          <h2 className="font-serif text-3xl leading-tight text-white">
            Become part of
            <br /> the Avadh family.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Create an account to book rooms, track your reservations and
            unlock a more personal stay with us.
          </p>
        </div>
      </div>

      {/* ── Right / Form Panel ── */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 md:hidden">
            <Image
              src="/logo.png"
              alt="Hotel Avadh logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="font-serif text-lg tracking-wide text-foreground">
              Hotel Avadh
            </span>
          </div>

          <div className="space-y-2">
            <span className="gold-rule" />
            <h1 className="font-serif text-3xl text-foreground">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up in seconds to start booking your stay.
            </p>
          </div>

          {success ? (
            <div className="space-y-6 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <CheckCircle2 className="mx-auto size-10 text-primary" />
              <div className="space-y-1">
                <p className="font-serif text-lg text-foreground">
                  You&apos;re all set
                </p>
                <p className="text-sm text-muted-foreground">{msg}</p>
              </div>
              <Button asChild size="lg" className="w-full justify-center gap-2">
                <Link href="/login">
                  Go to login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/40"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/40"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/40"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {passwordTooShort ? (
                    <p className="text-xs text-destructive">
                      Password must be at least 6 characters.
                    </p>
                  ) : null}
                </div>

                {msg && !success ? (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {msg}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={loading || passwordTooShort}
                  size="lg"
                  className="group w-full justify-center gap-2 py-5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
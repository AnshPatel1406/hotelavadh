"use client"; // Marks this file as a Client Component in Next.js.
// Needed because:

// button click
// browser interaction
// signIn function

// all run on client side.
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  function handleGoogle() {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/rooms" });
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
            Welcome back to
            <br /> refined hospitality.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Sign in to manage your bookings, revisit your favourite rooms and
            enjoy a seamless stay, every time.
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
            <h1 className="font-serif text-3xl text-foreground">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/40"
                  placeholder="••••••••"
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
            </div>

            {err ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {err}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="group w-full justify-center gap-2 py-5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={googleLoading}
            onClick={handleGoogle}
            className="w-full justify-center gap-2.5 py-5"
          >
            {googleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.76Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11C3.24 21.3 7.26 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.26a12 12 0 0 0 0 10.76l4.01-3.11Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.26 0 3.24 2.7 1.26 6.62l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as
      | (typeof req.nextauth.token & { role?: "admin" | "user" })
      | null;

    // Logged-in users shouldn't land back on /login or /signup
    if ((pathname === "/login" || pathname === "/signup") && token) {
      return NextResponse.redirect(new URL("/rooms", req.url));
    }

    // Only admins may access /admin/*
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/rooms", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // /login and /signup must stay reachable for logged-out users;
        // the middleware() above handles bouncing logged-in users away
        if (pathname === "/login" || pathname === "/signup") {
          return true;
        }

        // Every other matched route requires a valid session
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Routes this middleware runs on:
export const config = {
  matcher: [
    "/profile/:path*",
    "/my-bookings/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // you can add role-based checks later here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // allow only if logged in
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect these routes:
export const config = {
  matcher: ["/rooms/:path*", "/profile/:path*", "/my-bookings/:path*", "/admin/:path*"],
};
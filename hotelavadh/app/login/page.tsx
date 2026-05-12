"use client"; // Marks this file as a Client Component in Next.js.
// Needed because:

// button click
// browser interaction
// signIn function

// all run on client side.

import { signIn } from "next-auth/react";

export default function LoginPage() { // Creates React component/page named LoginPage. This will be rendered when user visits /login route. // This is the custom login page we specified in NextAuth config (pages.signIn). // When user tries to access protected route without being logged in, they will be redirected to this page.
  return (
    <div style={{ padding: 30 }}>
      <h1>Login</h1>
       <button onClick={() => signIn("google", { callbackUrl: "/home" })}> {/*// onclick runs signIn function from next-auth/react when button is clicked. // "google" is the provider we want to use for login. 
        // callbackUrl specifies where to redirect user after successful login. // In this case, we redirect them to /rooms page. */}
        Continue with Google
      </button>
    </div>
  );
}
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [ // provider is array of login methods // TODO : ADD OTP LOGIN Later
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET, // used for // encrypt Tokens // sign sessions // imporve security 
    session: { strategy: "jwt" }, // tells NextAuth to Store login session using JWT(JSON WEB TOKEN) tokens // instead of database sessions
    pages: {
        signIn: "/login", // redirect to Custom /Login Page when user tries to access protected route without being logged in
    },
    debug: process.env.NODE_ENV === "development", // Enable debugging only during development.//if in developement mode, NextAuth will log detailed information about the authentication process to the console.//This can help you identify and fix issues during development.//In production, this is disabled to avoid exposing sensitive information in logs.
    callbacks: { //Callbacks are functions NextAuth runs during auth flow.
        //Used to: modify token // modify session // add custom user data
        async jwt({ token, user }) { // Runs whenever JWT token is created/updated.
            if (user) token.id = (user as any).id;
            return token; // retruns updated Tokens
        },
        async session({ session, token }) { // Runs whenever session is checked/created. // Used to add custom data to session object that is accessible on client side.
            (session as any).user.id = token.id as string;
            return session;
        },
    },
},);

export { handler as GET, handler as POST };

// http://localhost:3000/api/auth/signin

// /my-bookings
// /profile
// /admin

// should only open if user is logged in.

// That is where NextAuth.js middleware is used.
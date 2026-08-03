import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";

const handler = NextAuth({
    // providers = Different login methods available in the app
    // TODO : Add OTP Login Later

    providers: [

        // GOOGLE OAUTH LOGIN
        // Allows users to login/signup using their Google account
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        // EMAIL + PASSWORD LOGIN
        // CredentialsProvider lets us create our own custom login logic
        CredentialsProvider({

            // Name shown internally by NextAuth
            name: "Credentials",

            // Defines fields expected from frontend login form
            credentials: {

                // Email input field
                email: {
                    label: "Email",
                    type: "text"
                },

                // Password input field
                password: {
                    label: "Password",
                    type: "password"
                },
            },

            // authorize() runs when user clicks "Login with Credentials"
            async authorize(credentials) {

                // Extract email/password from frontend form data
                const email = credentials?.email?.toLowerCase().trim();
                const password = credentials?.password;

                // If email or password missing -> reject login
                if (!email || !password) {
                    return null;
                }

                // Connect MongoDB before DB query
                await connectToDatabase();

                // Find user by email in MongoDB
                const user = await User.findOne({ email }).select("+password");

                // If user not found OR user has no password -> reject login
                if (!user || !user.password) {
                    return null;
                }

                // Compare entered password with hashed password stored in DB
                const isPasswordCorrect = await bcrypt.compare(
                    password,
                    user.password
                );

                // If password incorrect -> reject login
                if (!isPasswordCorrect) {
                    return null;
                }

                // If login successful -> return user object
                // This object becomes available inside JWT + session callbacks
                return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || "",
    role: user.role,
};
            },
        }),
    ],

    // Secret used by NextAuth for:
    // encrypting JWT tokens
    // signing sessions
    // improving security
    secret: process.env.NEXTAUTH_SECRET,

    // Store sessions using JWT instead of database sessions
    // Easier and cleaner for small-medium apps
    session: {
        strategy: "jwt"
    },

    // Custom auth pages
    pages: {

        // If user tries to access protected routes without login
        // Redirect user to /login page
        signIn: "/login",
    },

    // Show detailed auth logs ONLY during development
    debug: process.env.NODE_ENV === "development",

    callbacks: {

        // signIn callback runs AFTER successful login
        async signIn({ user, account }) {

    if (account?.provider === "google") {

        await connectToDatabase();

        const email = user.email?.toLowerCase().trim();

        if (!email) {
            return false;
        }

        let existingUser = await User.findOne({ email });

        if (!existingUser) {

            existingUser = await User.create({

                name: user.name || "User",
                email,
                image: user.image || "",
                provider: "google",
                role: "user",

            });

        }

        (user as any).id = existingUser._id.toString();
        (user as any).role = existingUser.role;
    }

    return true;
},

        // jwt callback runs whenever JWT token is created/updated
        async jwt({ token, user }) {

    if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
    }

    return token;
},

        // session callback runs whenever session is accessed
        async session({ session, token }) {

    (session as any).user.id = token.id as string;
    (session as any).user.role = token.role as "admin" | "user" | "reception";

    return session;
},
    },
});

export { handler as GET, handler as POST };


// Useful protected routes later:

// /my-bookings
// /profile
// /admin

// These routes should only open if user is logged in

// NextAuth middleware will protect them
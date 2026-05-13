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

            // If user logged in using Google OAuth
            if (account?.provider === "google") {

                // Connect database
                await connectToDatabase();

                // Get email safely
                const email = user.email?.toLowerCase().trim();

                // Reject login if email missing
                if (!email) {
                    return false;
                }

                // Check if user already exists in MongoDB
                const existingUser = await User.findOne({ email });

                // If user does NOT exist -> create new user
                if (!existingUser) {

                    await User.create({

                        // User name from Google
                        name: user.name || "User",

                        // User email from Google
                        email,

                        // Google profile image
                        image: user.image || "",

                        // Login provider
                        provider: "google",

                        // Default role
                        role: "user",
                    });
                }
            }

            // Allow login
            return true;
        },

        // jwt callback runs whenever JWT token is created/updated
        async jwt({ token, user }) {

            // If user exists -> add user id into token
            // So we can access it later from session
            if (user) {
                token.id = (user as any).id;
            }

            // Return updated token
            return token;
        },

        // session callback runs whenever session is accessed
        async session({ session, token }) {

            // Copy user id from token into session object
            // So frontend can access:
            // session.user.id
            (session as any).user.id = token.id as string;

            // Return updated session
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
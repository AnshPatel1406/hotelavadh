"use client";

import "./globals.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/providers/SessionProvider";
import { Playfair_Display, DM_Sans, Geist } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("light", playfair.variable, dmSans.variable, geist.variable)}>
      <body className={cn("min-h-screen bg-background text-foreground")}>
  <AuthProvider>
    <Navbar />

    <main className="mx-auto max-w-6xl px-4 py-10">
      {children}
    </main>

    <Footer />
  </AuthProvider>
</body>
    </html>
  );
}
// 4) src/app/layout.tsx (wrap with SessionProvider)
"use client";

import { SessionProvider } from "next-auth/react";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
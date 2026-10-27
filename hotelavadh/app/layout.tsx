import "./globals.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/providers/SessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background text-foreground font-sans")}>
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
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daya Lokesh Duddupudi | Backend Engineer",
  description: "Portfolio of Daya Lokesh Duddupudi, a Senior Python Backend Engineer and Full Stack Developer specializing in distributed systems and IoT.",
  keywords: ["Python", "FastAPI", "Backend", "Distributed Systems", "IoT", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen flex flex-col"
        )}
      >
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
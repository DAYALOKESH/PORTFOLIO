import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";

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
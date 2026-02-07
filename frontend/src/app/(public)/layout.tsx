'use client';

import Navbar from "@/components/ui/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-8 text-center text-muted/40 text-sm border-t border-white/5 bg-slate-950">
        <p>© {new Date().getFullYear()} Daya Lokesh Duddupudi. All rights reserved.</p>
      </footer>
    </>
  );
}

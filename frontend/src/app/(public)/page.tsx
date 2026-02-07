import Hero from "@/components/sections/Hero";
import RecentPosts from "@/components/sections/RecentPosts";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Quick Links Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container-width">
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/about"
              className="group p-8 rounded-xl border border-white/10 hover:border-accent/50 bg-slate-950/50 transition-all hover:bg-accent/5"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">About Me</h3>
              <p className="text-muted">Learn about my experience, skills, and education background.</p>
            </Link>

            <Link
              href="/projects"
              className="group p-8 rounded-xl border border-white/10 hover:border-accent/50 bg-slate-950/50 transition-all hover:bg-accent/5"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">Projects</h3>
              <p className="text-muted">Explore my portfolio of distributed systems and full-stack work.</p>
            </Link>

            <Link
              href="/contact"
              className="group p-8 rounded-xl border border-white/10 hover:border-accent/50 bg-slate-950/50 transition-all hover:bg-accent/5"
            >
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">Get in Touch</h3>
              <p className="text-muted">Have a project in mind? Let&apos;s discuss how I can help.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <RecentPosts />
    </div>
  );
}

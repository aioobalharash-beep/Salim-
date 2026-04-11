"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const panels = [
  {
    icon: "edit_note",
    title: "Manage Journal",
    description:
      "Create, edit, and archive perspectives. Control categories, publication dates, and featured status.",
    href: "/backstage/journal/new",
    count: "Write & Publish",
  },
  {
    icon: "perm_media",
    title: "Update Media",
    description:
      "Upload performance photography, press images, and archival recordings to the public gallery.",
    href: "/backstage/hero",
    count: "Edit Hero Panels",
  },
  {
    icon: "person",
    title: "About Salim",
    description:
      "Edit the public biography, career highlights, profile image, and philosophical statement on the About page.",
    href: "/backstage/about",
    count: "Edit Biography",
  },
  {
    icon: "storefront",
    title: "Shop Settings",
    description:
      "Manage product listings, pricing, and availability for scores, recordings, and publications.",
    href: "/backstage/dashboard",
    count: "Coming Soon",
  },
];

export default function BackstageDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="border-b border-outline-variant/10 px-6 md:px-12 py-6">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-serif-brand text-lg tracking-widest uppercase text-on-surface"
            >
              Salim Dada
            </Link>
            <span className="w-[1px] h-5 bg-outline-variant/20" />
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/60">
              Backstage
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="font-label text-[10px] uppercase tracking-widest text-primary/50 hover:text-error transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-16">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
            Control Panel
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-light mb-4">
            Good evening, Maestro.
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-lg">
            Manage your public presence — journal entries, media, and hero
            panels — from a single view.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {panels.map((panel) => (
            <Link
              key={panel.title}
              href={panel.href}
              className="group bg-surface-container-low border border-outline-variant/10 p-10 flex flex-col min-h-[280px] hover:bg-surface-container-high transition-colors duration-500"
            >
              <span className="material-symbols-outlined text-primary text-3xl mb-8">
                {panel.icon}
              </span>
              <h3 className="font-serif-brand text-2xl mb-3 text-on-surface group-hover:text-primary transition-colors duration-300">
                {panel.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant flex-grow mb-8">
                {panel.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                  {panel.count}
                </span>
                <span className="material-symbols-outlined text-primary text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

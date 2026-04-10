"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = ["Musicology", "Pedagogy", "Cultural Heritage", "Composition"];

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    excerpt: "",
    content: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      setSaving(false);
    } else {
      alert("Failed to publish. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="border-b border-outline-variant/10 px-6 md:px-12 py-6">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/backstage/dashboard"
              className="font-label text-[10px] uppercase tracking-widest text-primary/50 hover:text-on-surface transition-colors"
            >
              &larr; Dashboard
            </Link>
            <span className="w-[1px] h-5 bg-outline-variant/20" />
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface">
              New Perspective
            </span>
          </div>
          <button
            onClick={handlePublish}
            disabled={!form.title || !form.content || saving}
            className="px-8 py-2.5 bg-primary text-on-primary font-label text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {saving ? "Publishing..." : saved ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-screen-md mx-auto px-6 md:px-12 py-16">
        <form onSubmit={handlePublish} className="space-y-12">
          {/* Title */}
          <div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Article title..."
              className="w-full bg-transparent border-0 px-0 py-4 font-serif-brand text-3xl md:text-4xl text-on-surface placeholder:text-on-surface-variant/25 focus:ring-0 focus:outline-none"
            />
            <div className="w-16 h-[1px] bg-primary/20 mt-2" />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm appearance-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Status
              </label>
              <p className="py-3 font-body text-sm text-primary/60 border-b border-outline-variant/30">
                {saved ? "Published to Journal" : "Draft — not yet published"}
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="flex flex-col space-y-3">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="A brief summary that appears on the Journal listing..."
              rows={3}
              className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm leading-relaxed resize-none transition-colors placeholder:text-on-surface-variant/30"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Content
              </label>
              <span className="font-label text-[9px] uppercase tracking-widest text-primary/30">
                Markdown supported
              </span>
            </div>
            <textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder={"Begin writing your perspective...\n\nUse **bold**, *italic*, ## headings, and > blockquotes."}
              rows={18}
              className="bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 focus:ring-0 p-6 font-body text-sm leading-relaxed resize-y transition-colors placeholder:text-on-surface-variant/25"
            />
          </div>

          {/* Confirmation */}
          {saved && (
            <div className="flex items-center gap-3 py-4 px-6 bg-tertiary-container/30 border border-tertiary/10">
              <span className="material-symbols-outlined text-tertiary text-lg">
                check_circle
              </span>
              <p className="font-label text-[10px] uppercase tracking-widest text-tertiary">
                Published successfully.{" "}
                <Link href="/journal" className="underline underline-offset-4">
                  View Journal →
                </Link>
              </p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

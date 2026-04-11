"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AboutData {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  portraitUrl: string;
  portraitAlt: string;
  biographyTitle: string;
  biographyParagraphs: string[];
  pullQuote: string;
  unescoCards: { icon: string; title: string; description: string }[];
  milestones: { year: string; title: string; description: string }[];
  philosophyTitle: string;
  philosophyText: string;
  philosophyImageUrl: string;
  philosophyImageAlt: string;
}

export default function AboutEditorPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const update = (field: keyof AboutData, value: string | string[]) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSaved(false);
  };

  const updateMilestone = (
    index: number,
    field: "year" | "title" | "description",
    value: string
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = [...prev.milestones];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, milestones: next };
    });
    setSaved(false);
  };

  const updateUnescoCard = (
    index: number,
    field: "icon" | "title" | "description",
    value: string
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = [...prev.unescoCards];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, unescoCards: next };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSaved(true);
    }
    setSaving(false);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-label text-[10px] uppercase tracking-widest text-primary/40">
          Loading about data...
        </p>
      </div>
    );
  }

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
              About Salim
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-primary text-on-primary font-label text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-screen-md mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <h1 className="font-headline text-3xl font-light mb-2">
            Edit About Page
          </h1>
          <p className="font-body text-sm text-on-surface-variant">
            Update biography, milestones, and philosophy displayed on the public
            About Salim page.
          </p>
        </div>

        <div className="space-y-16">
          {/* ── Hero Section ── */}
          <section className="space-y-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary/60 border-b border-outline-variant/10 pb-3">
              Hero Section
            </h2>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Tag Line
              </label>
              <input
                type="text"
                value={data.heroTag}
                onChange={(e) => update("heroTag", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Title
              </label>
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) => update("heroTitle", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-serif-brand text-2xl transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Short Introduction
              </label>
              <textarea
                value={data.heroSubtitle}
                onChange={(e) => update("heroSubtitle", e.target.value)}
                rows={3}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm leading-relaxed resize-none transition-colors"
              />
            </div>
          </section>

          {/* ── Portrait ── */}
          <section className="space-y-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary/60 border-b border-outline-variant/10 pb-3">
              Profile Image
            </h2>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Image URL
              </label>
              <input
                type="url"
                value={data.portraitUrl}
                onChange={(e) => update("portraitUrl", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-xs text-on-surface-variant transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Alt Text
              </label>
              <input
                type="text"
                value={data.portraitAlt}
                onChange={(e) => update("portraitAlt", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
              />
            </div>
          </section>

          {/* ── Biography ── */}
          <section className="space-y-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary/60 border-b border-outline-variant/10 pb-3">
              Full Biography
            </h2>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Section Title
              </label>
              <input
                type="text"
                value={data.biographyTitle}
                onChange={(e) => update("biographyTitle", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
              />
            </div>
            {data.biographyParagraphs.map((para, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                  Paragraph {i + 1}
                </label>
                <textarea
                  value={para}
                  onChange={(e) => {
                    const next = [...data.biographyParagraphs];
                    next[i] = e.target.value;
                    update("biographyParagraphs", next);
                  }}
                  rows={4}
                  className="bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 focus:ring-0 p-4 font-body text-sm leading-relaxed resize-y transition-colors"
                />
              </div>
            ))}
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Pull Quote
              </label>
              <textarea
                value={data.pullQuote}
                onChange={(e) => update("pullQuote", e.target.value)}
                rows={3}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm italic leading-relaxed resize-none transition-colors"
              />
            </div>
          </section>

          {/* ── Career Highlights / Milestones ── */}
          <section className="space-y-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary/60 border-b border-outline-variant/10 pb-3">
              Career Highlights
            </h2>
            {data.milestones.map((m, i) => (
              <div
                key={i}
                className="bg-surface-container-low border border-outline-variant/10 p-8"
              >
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/40 mb-6">
                  Milestone {i + 1}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                      Year
                    </label>
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) =>
                        updateMilestone(i, "year", e.target.value)
                      }
                      className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
                    />
                  </div>
                  <div className="flex flex-col space-y-2 md:col-span-3">
                    <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                      Title
                    </label>
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) =>
                        updateMilestone(i, "title", e.target.value)
                      }
                      className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 mt-6">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                    Description
                  </label>
                  <textarea
                    value={m.description}
                    onChange={(e) =>
                      updateMilestone(i, "description", e.target.value)
                    }
                    rows={2}
                    className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm leading-relaxed resize-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </section>

          {/* ── Philosophy ── */}
          <section className="space-y-6">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-primary/60 border-b border-outline-variant/10 pb-3">
              Philosophy Section
            </h2>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Title
              </label>
              <input
                type="text"
                value={data.philosophyTitle}
                onChange={(e) => update("philosophyTitle", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Text
              </label>
              <textarea
                value={data.philosophyText}
                onChange={(e) => update("philosophyText", e.target.value)}
                rows={4}
                className="bg-surface-container-low border border-outline-variant/10 focus:border-primary/30 focus:ring-0 p-4 font-body text-sm leading-relaxed resize-y transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                Image URL
              </label>
              <input
                type="url"
                value={data.philosophyImageUrl}
                onChange={(e) => update("philosophyImageUrl", e.target.value)}
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-xs text-on-surface-variant transition-colors"
              />
            </div>
          </section>
        </div>

        {/* Confirmation */}
        {saved && (
          <div className="mt-12 flex items-center gap-3 py-4 px-6 bg-tertiary-container/30 border border-tertiary/10">
            <span className="material-symbols-outlined text-tertiary text-lg">
              check_circle
            </span>
            <p className="font-label text-[10px] uppercase tracking-widest text-tertiary">
              About page updated.{" "}
              <Link href="/about" className="underline underline-offset-4">
                View About Page →
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

interface HeroPanel {
  id: string;
  subtitle: string;
  title: string;
  src: string;
  alt: string;
}

export default function HeroEditorPage() {
  const [panels, setPanels] = useState<HeroPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => {
        setPanels(data);
        setLoading(false);
      });
  }, []);

  const updatePanel = (index: number, field: keyof HeroPanel, value: string) => {
    setPanels((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(panels),
    });
    if (res.ok) {
      setSaved(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-label text-[10px] uppercase tracking-widest text-primary/40">
          Loading panels...
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
              Hero Panels
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

      {/* Panel Editor */}
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <h1 className="font-headline text-3xl font-light mb-2">
            Edit Hero Columns
          </h1>
          <p className="font-body text-sm text-on-surface-variant">
            Update the four identity panels displayed on the Home page.
          </p>
        </div>

        <div className="space-y-12">
          {panels.map((panel, i) => (
            <div
              key={panel.id}
              className="bg-surface-container-low border border-outline-variant/10 p-8 md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                  Panel {i + 1}
                </span>
                <span className="w-[1px] h-4 bg-outline-variant/20" />
                <span className="font-serif-brand text-lg text-on-surface">
                  {panel.title}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Subtitle */}
                <div className="flex flex-col space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={panel.subtitle}
                    onChange={(e) => updatePanel(i, "subtitle", e.target.value)}
                    className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
                  />
                </div>

                {/* Title */}
                <div className="flex flex-col space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                    Title
                  </label>
                  <input
                    type="text"
                    value={panel.title}
                    onChange={(e) => updatePanel(i, "title", e.target.value)}
                    className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <ImageUpload
                    value={panel.src}
                    onChange={(url) => updatePanel(i, "src", url)}
                    label={`Panel ${i + 1} Image`}
                    aspect="aspect-[4/5]"
                  />
                </div>

                {/* Alt Text */}
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={panel.alt}
                    onChange={(e) => updatePanel(i, "alt", e.target.value)}
                    className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation */}
        {saved && (
          <div className="mt-8 flex items-center gap-3 py-4 px-6 bg-tertiary-container/30 border border-tertiary/10">
            <span className="material-symbols-outlined text-tertiary text-lg">
              check_circle
            </span>
            <p className="font-label text-[10px] uppercase tracking-widest text-tertiary">
              Hero panels updated.{" "}
              <Link href="/" className="underline underline-offset-4">
                View Home Page →
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

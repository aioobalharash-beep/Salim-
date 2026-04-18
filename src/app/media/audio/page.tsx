import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { audioListQuery } from "@/sanity/queries";
import AudioGallery from "@/components/AudioGallery";

export const metadata: Metadata = {
  title: "Audio — Salim Dada",
  description:
    "A scholarly gallery of the Maestro's recordings — compositions, field recordings, and orchestral works.",
};

export const revalidate = 60;

export default async function AudioPage() {
  let tracks = [];
  try {
    tracks = (await client.fetch(audioListQuery)) ?? [];
  } catch {
    // Sanity unavailable — gallery will show seed data
  }

  return (
    <div className="min-h-screen pt-44 pb-40">
      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 mb-20">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-8">
          Recordings
        </p>
        <h1 className="font-headline text-5xl md:text-7xl font-light text-on-surface leading-[1.1] mb-8">
          Audio
        </h1>
        <p className="font-body text-base leading-relaxed text-on-surface/50 max-w-xl">
          Compositions, field recordings, and orchestral works — each piece a
          bridge between the written score and the living tradition.
        </p>
      </section>

      {/* Gallery */}
      <section className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="border-t border-on-surface/[0.06]" />
        <AudioGallery tracks={tracks} />
      </section>
    </div>
  );
}

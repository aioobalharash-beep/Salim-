import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { audioListQuery } from "@/sanity/queries";
import AudioGallery from "@/components/AudioGallery";

export const metadata: Metadata = {
  title: "Discography — Salim Dada",
  description:
    "An archive of the Maestro's recordings — compositions, field recordings, and orchestral works.",
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
      <section className="max-w-3xl mx-auto px-6 md:px-8 mb-16">
        <h1 className="font-serif-brand text-[1.65rem] md:text-[1.85rem] font-normal text-on-surface tracking-tight">
          Discography
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="border-t border-primary/15" />
        <AudioGallery tracks={tracks} />
      </section>
    </div>
  );
}

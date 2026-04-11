import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { journalListQuery } from "@/sanity/queries";
import JournalFilter from "@/components/JournalFilter";

export const metadata: Metadata = {
  title: "Journal — Salim Dada",
  description:
    "Long-form reflections on musicology, cultural preservation, pedagogy, and Mediterranean musical traditions.",
};

export const revalidate = 60;

export default async function JournalPage() {
  const articles = await client.fetch(journalListQuery);

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-44 pb-40">
      {/* ── Header ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 mb-20">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-[#586059]/50 mb-8">
          Perspectives
        </p>
        <h1 className="font-headline text-5xl md:text-7xl font-light text-[#2C2C2C] leading-[1.1] mb-8">
          Journal
        </h1>
        <p className="font-body text-base leading-relaxed text-[#2C2C2C]/50 max-w-xl">
          Long-form reflections on musicology, cultural preservation, pedagogy,
          and the invisible threads connecting Mediterranean musical traditions.
        </p>
      </section>

      <JournalFilter articles={articles ?? []} />
    </div>
  );
}

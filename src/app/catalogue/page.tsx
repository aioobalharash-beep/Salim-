import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { catalogueListQuery } from "@/sanity/queries";
import CatalogueFilter, {
  type CatalogueWork,
} from "@/components/CatalogueFilter";

export const metadata: Metadata = {
  title: "Catalogue — Salim Dada",
  description:
    "The complete catalogue of compositions by Salim Dada — chamber, symphonic, vocal, and contemporary works, with premiere histories and listening links.",
};

export const revalidate = 60;

export default async function CataloguePage() {
  let works: CatalogueWork[] = [];
  try {
    works = (await client.fetch<CatalogueWork[]>(catalogueListQuery)) ?? [];
  } catch {
    // Sanity unavailable — render empty catalogue
  }

  return (
    <div className="min-h-screen bg-background pt-44 pb-40">
      {/* ── Header ── */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 mb-20">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-8">
          Œuvre
        </p>
        <h1 className="font-headline text-5xl md:text-7xl font-light text-foreground leading-[1.1] mb-8">
          Catalogue
        </h1>
        <p className="font-body text-base leading-relaxed text-foreground/55 max-w-2xl">
          A curated record of compositions — chamber, orchestral, choral, and
          contemporary — with premiere histories, performer credits, and
          listening links where available.
        </p>
      </section>

      <CatalogueFilter works={works} />
    </div>
  );
}

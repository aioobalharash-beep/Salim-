import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { catalogueListQuery } from "@/sanity/queries";
import { buildMetadata } from "@/sanity/seo";
import CatalogueFilter, {
  type CatalogueWork,
} from "@/components/CatalogueFilter";

export const revalidate = 60;

const FALLBACK_TITLE = "Catalogue";
const FALLBACK_DESCRIPTION =
  "The complete catalogue of compositions by Salim Dada — chamber, symphonic, vocal, and contemporary works, with premiere histories and audio and video links.";

async function getWorks(): Promise<CatalogueWork[]> {
  try {
    return (await client.fetch<CatalogueWork[]>(catalogueListQuery)) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const works = await getWorks();
  const aggregatedKeywords = Array.from(
    new Set(
      works
        .flatMap((w) => [w.genre, w.instrumentation].filter(Boolean) as string[])
    )
  ).slice(0, 12);

  return buildMetadata({
    seo: aggregatedKeywords.length
      ? { keywords: aggregatedKeywords }
      : undefined,
    fallbackTitle: FALLBACK_TITLE,
    fallbackDescription: FALLBACK_DESCRIPTION,
    url: "/catalogue",
  });
}

function buildMusicCompositionJsonLd(works: CatalogueWork[]) {
  return works.map((work) => ({
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "@id": work.slug ? `/catalogue#${work.slug}` : undefined,
    name: work.title,
    alternateName: work.subtitle || undefined,
    composer: {
      "@type": "Person",
      name: "Salim Dada",
      url: "/about",
    },
    dateCreated: work.year || undefined,
    musicCompositionForm: work.genre || undefined,
    musicalKey: undefined,
    inLanguage: undefined,
    description: work.seo?.metaDescription || work.description || undefined,
    keywords:
      work.seo?.keywords?.join(", ") ||
      [work.genre, work.instrumentation].filter(Boolean).join(", ") ||
      undefined,
    firstPerformance: work.premiereDate
      ? {
          "@type": "Event",
          startDate: work.premiereDate,
          location: work.premierePlace || undefined,
          performer: work.performers || undefined,
        }
      : undefined,
    recordedAs:
      work.audioFileUrl || work.audioUrl
        ? {
            "@type": "MusicRecording",
            contentUrl: work.audioFileUrl || work.audioUrl,
          }
        : undefined,
    url: work.watchLink || undefined,
  }));
}

export default async function CataloguePage() {
  const works = await getWorks();
  const jsonLd = buildMusicCompositionJsonLd(works);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ── */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 mb-12">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-5">
          Œuvre
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-light text-foreground leading-[1.1] mb-6">
          Catalogue
        </h1>
        <p className="font-body text-base leading-relaxed text-foreground/55 max-w-2xl">
          A curated record of compositions — chamber, orchestral, choral, and
          contemporary — with premiere histories, performer credits, audio and video links where available.
        </p>
      </section>

      <CatalogueFilter works={works} />
    </div>
  );
}

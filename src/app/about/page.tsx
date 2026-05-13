import type { Metadata } from "next";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { aboutQuery, catalogueListQuery } from "@/sanity/queries";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";
import type { CatalogueWork } from "@/components/CatalogueFilter";

export const revalidate = 60;

const FALLBACK_TITLE = "About Dada";
const FALLBACK_DESCRIPTION =
  "The narrative of Salim Dada: composer, conductor, musicologist, and UNESCO cultural envoy bridging silence and sound across the Mediterranean.";

export async function generateMetadata(): Promise<Metadata> {
  let about: AboutData | null = null;
  try {
    about = await client.fetch(aboutQuery);
  } catch {
    // Sanity unavailable — use fallbacks
  }
  return buildMetadata({
    seo: about?.seo,
    fallbackTitle: FALLBACK_TITLE,
    fallbackDescription: FALLBACK_DESCRIPTION,
    fallbackImage: about?.profileImage,
    url: "/about",
  });
}

interface ChronologyItem {
  year: string;
  title: string;
  description?: string;
}

interface AboutData {
  profileImage?: SanityImageSource & { alt?: string };
  imageCaption?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  bioTitle?: string;
  bio?: PortableTextBlock[];
  mainBio?: PortableTextBlock[];
  shortIntro?: string;
  pullQuote?: string;
  timelineTitle?: string;
  chronology?: ChronologyItem[];
  seo?: SeoSettings | null;
}

// Seed data used when Sanity has no About document yet
const seed = {
  shortIntro:
    "An exploration of heritage through the lens of orchestral composition and the preservation of intangible cultural wealth.",
  portraitUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB4ZEQYY7Ri_chR0QDOeR52SkaGDmUOz6t4MNGlHfuUh8XwVUoD19NQ8gP3QTN8-1sPXZE4zEPlhTb7zpQTrK33vt8O29vxkz74OM3ammZ41Luu017AVfBczImYwRoxtZd5woER6l9BGVScyUaegpTkUWdcPiqUXD7tPmYcDnqUar2cNExw2oFgjZjsvwR81ZRkYe456wcCNXjbzSV_S8i5CTOR00w4nSbnQB-Y7lrSyMESnCllIWuu6PF7QkXrYDleAVoBeiL3c7g",
  biographyParagraphs: [
    "Salim Dada stands at the confluence of diverse musical worlds. As a composer, conductor, and musicologist, his work is an ongoing dialogue between the formal rigor of Western polyphony and the profound modal traditions of the Mediterranean.",
    "Born with an innate curiosity for the \u201cunwritten,\u201d Dada has spent decades transcribing the ephemeral \u2014 capturing the nuances of traditional Algerian music and elevating them to the symphonic stage. His compositions are not merely pieces of music; they are archival acts.",
    "His academic journey across the conservatories of Paris and Algiers provided the technical foundation for what would become a signature style: a harmonic language that is simultaneously ancient and avant-garde.",
  ],
  pullQuote:
    "The baton does not just direct the orchestra; it directs the memory of a people back into the present air.",
  chronology: [
    {
      year: "2012",
      title: "Orchestre Symphonique National",
      description:
        "Appointed as Resident Composer, premiering \u2018The Symphony of Sand\u2019 to international acclaim.",
    },
    {
      year: "2018",
      title: "UNESCO ICH Expert",
      description:
        "Formal induction into the International Committee for the Safeguarding of Intangible Cultural Heritage.",
    },
    {
      year: "2023",
      title: "Global Merit Award",
      description:
        "Recognition for a lifetime of work bridging musical diplomacy and archival science across three continents.",
    },
  ],
};

// Shared PortableText components — scholarly serif typography matching Articles
const richTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-headline text-[1.05rem] md:text-lg leading-[2] text-on-surface-variant/70 mb-7">
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-headline text-[1.75rem] md:text-[2rem] leading-snug mt-20 mb-8 text-on-surface">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-headline text-xl md:text-2xl leading-snug mt-16 mb-6 text-on-surface">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-14 mx-0 md:-mx-4 pl-8 md:pl-10 border-l-[2px] border-primary/20 py-1">
        <p className="font-headline italic text-xl md:text-[1.4rem] leading-relaxed text-primary/80">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium text-on-surface">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="text-on-surface/70">{children}</em>
    ),
  },
};

export default async function AboutPage() {
  let about: AboutData | null = null;
  let catalogueWorks: CatalogueWork[] = [];

  try {
    about = await client.fetch(aboutQuery);
  } catch {
    // Sanity unavailable — use seed data
  }
  try {
    catalogueWorks =
      (await client.fetch<CatalogueWork[]>(catalogueListQuery)) ?? [];
  } catch {
    // ignore — JSON-LD will only include Person
  }

  const profileImageUrl = about?.profileImage
    ? urlFor(about.profileImage).width(1200).url()
    : undefined;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Salim Dada",
    url: "/about",
    image: profileImageUrl,
    jobTitle: "Composer, Conductor, Musicologist",
    description:
      about?.seo?.metaDescription || FALLBACK_DESCRIPTION,
    sameAs: undefined,
    nationality: "Algerian",
    knowsAbout: [
      "Composition",
      "Orchestration",
      "Conducting",
      "Musicology",
      "Mediterranean Music",
      "Intangible Cultural Heritage",
    ],
  };

  const compositionsJsonLd = catalogueWorks.map((work) => ({
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: work.title,
    alternateName: work.subtitle || undefined,
    composer: { "@type": "Person", name: "Salim Dada", url: "/about" },
    dateCreated: work.year || undefined,
    musicCompositionForm: work.genre || undefined,
    description: work.seo?.metaDescription || work.description || undefined,
    firstPerformance: work.premiereDate
      ? {
          "@type": "Event",
          startDate: work.premiereDate,
          location: work.premierePlace || undefined,
          performer: work.performers || undefined,
        }
      : undefined,
    url: work.watchLink || undefined,
  }));

  const jsonLd = [personJsonLd, ...compositionsJsonLd];

  const pullQuote = about?.pullQuote || seed.pullQuote;
  const heroTitle = about?.heroTitle || "Between Silence & Sound.";
  const heroSubtitle = about?.heroSubtitle;
  const bioTitle = about?.bioTitle;
  const timelineTitle = about?.timelineTitle || "A Chronology of Precision";
  const imageCaption = about?.imageCaption || "Biographical Archive 001";
  const hasSanityImage = !!about?.profileImage;
  const hasSanityBio = (about?.bio?.length ?? 0) > 0;
  const hasSanityMainBio = (about?.mainBio?.length ?? 0) > 0;
  const chronology =
    about?.chronology && about.chronology.length > 0
      ? about.chronology
      : seed.chronology;

  return (
    <div className="pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero: Centered Statement ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-32">
        <div className="max-w-5xl mx-auto text-center py-16 md:py-24">
          <h1 className="font-serif-brand text-6xl md:text-8xl font-light leading-tight text-on-surface tracking-tighter italic">
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="font-headline text-lg md:text-xl leading-relaxed text-on-surface-variant/70 mt-8 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── Biography: The Archival Folder ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          {/* Sticky Portrait */}
          <div className="md:col-span-5">
            <div className="sticky top-40">
              <div className="bg-surface-container-low rounded-lg relative">
                <Image
                  src={
                    hasSanityImage
                      ? urlFor(about!.profileImage!).width(1200).url()
                      : seed.portraitUrl
                  }
                  alt={about?.profileImage?.alt || "Portrait of Salim Dada"}
                  width={1200}
                  height={1500}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="w-full h-auto object-contain rounded-lg"
                  priority
                />
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-[1px] w-12 bg-outline-variant/30" />
                <span className="font-label text-[10px] uppercase tracking-widest text-primary">
                  {imageCaption}
                </span>
              </div>
            </div>
          </div>

          {/* Biography Text */}
          <div className="md:col-span-7">
            <div className="max-w-2xl">
              {bioTitle && (
                <h2 className="font-serif-brand text-3xl md:text-4xl font-light leading-tight text-on-surface tracking-tight mb-10">
                  {bioTitle}
                </h2>
              )}
              {hasSanityBio ? (
                <div>
                  <PortableText
                    value={about!.bio!}
                    components={richTextComponents}
                  />
                </div>
              ) : (
                <div>
                  {seed.biographyParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="font-headline text-[1.05rem] md:text-lg leading-[2] text-on-surface-variant/70 mb-7"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              <blockquote className="my-14 mx-0 md:-mx-4 pl-8 md:pl-10 border-l-[2px] border-primary/20 py-1">
                <p className="font-headline italic text-xl md:text-[1.4rem] leading-relaxed text-primary/80">
                  &ldquo;{pullQuote}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Long-Form Biography ── */}
      {hasSanityMainBio && (
        <section className="mb-48">
          <div className="max-w-[700px] mx-auto px-6 md:px-8">
            <div className="w-12 h-[1px] bg-on-surface/10 mb-20" />
            <PortableText
              value={about!.mainBio!}
              components={richTextComponents}
            />
            <div className="w-12 h-[1px] bg-on-surface/10 mt-20" />
          </div>
        </section>
      )}

      {/* ── Chronology of Precision ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 pb-32">
        <div className="mb-24 text-center">
          <p className="font-label text-[9px] uppercase tracking-[0.5em] text-primary/40 mb-5">
            Career Timeline
          </p>
          <h2 className="font-serif-brand text-4xl md:text-5xl italic text-on-surface font-light">
            {timelineTitle}
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central vertical line — Bronze (var(--accent)) at 40% for clear visibility on Ivory */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/40 md:-translate-x-px" />

          <div className="space-y-0">
            {chronology.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={`${item.year}-${i}`}
                  className="relative grid grid-cols-1 md:grid-cols-2"
                >
                  {/* ── Dot on the centre line — vertically centered with the Year text ── */}
                  <div className="absolute left-4 md:left-1/2 top-[14px] md:top-[18px] w-[7px] h-[7px] -translate-x-[3px] md:-translate-x-[3.5px] rounded-full bg-primary ring-[3px] ring-background z-10" />

                  {/* ── LEFT column ── */}
                  <div
                    className={`pl-12 md:pl-0 ${
                      isLeft
                        ? "md:pr-16 md:text-right"
                        : "md:pr-16 md:text-right md:order-1"
                    } pb-5 md:pb-7`}
                  >
                    {isLeft ? (
                      <>
                        <span className="font-serif-brand font-bold text-2xl md:text-3xl text-primary block leading-none mb-2">
                          {item.year}
                        </span>
                        <h4 className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface font-medium mb-2">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="font-body text-sm leading-relaxed text-on-surface-variant/60 max-w-sm md:ml-auto">
                            {item.description}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  {/* ── RIGHT column ── */}
                  <div
                    className={`hidden md:block ${
                      isLeft
                        ? "md:pl-16"
                        : "md:pl-16 md:order-2"
                    } pb-7`}
                  >
                    {!isLeft && (
                      <>
                        <span className="font-serif-brand font-bold text-2xl md:text-3xl text-primary block leading-none mb-2">
                          {item.year}
                        </span>
                        <h4 className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface font-medium mb-2">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="font-body text-sm leading-relaxed text-on-surface-variant/60 max-w-sm">
                            {item.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* ── Mobile: right-side items render in left col ── */}
                  {!isLeft && (
                    <div className="md:hidden pl-12 pb-5">
                      <span className="font-serif-brand font-bold text-2xl text-primary block leading-none mb-2">
                        {item.year}
                      </span>
                      <h4 className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface font-medium mb-2">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="font-body text-sm leading-relaxed text-on-surface-variant/60 max-w-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

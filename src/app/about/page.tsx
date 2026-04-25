import type { Metadata } from "next";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { aboutQuery } from "@/sanity/queries";
import { urlFor, type SanityImageSource } from "@/sanity/image";

export const metadata: Metadata = {
  title: "About Salim — Salim Dada",
  description:
    "The narrative of Salim Dada: composer, conductor, musicologist, and UNESCO cultural envoy bridging silence and sound across the Mediterranean.",
};

export const revalidate = 60;

interface ChronologyItem {
  year: string;
  title: string;
  description?: string;
}

interface AboutData {
  profileImage?: SanityImageSource;
  heroTitle?: string;
  bioTitle?: string;
  bio?: PortableTextBlock[];
  mainBio?: PortableTextBlock[];
  shortIntro?: string;
  pullQuote?: string;
  chronology?: ChronologyItem[];
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

// Shared PortableText components — scholarly serif typography matching Journal
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

  try {
    about = await client.fetch(aboutQuery);
  } catch {
    // Sanity unavailable — use seed data
  }

  const pullQuote = about?.pullQuote || seed.pullQuote;
  const heroTitle = about?.heroTitle || "Between Silence & Sound.";
  const bioTitle = about?.bioTitle;
  const hasSanityImage = !!about?.profileImage;
  const hasSanityBio = (about?.bio?.length ?? 0) > 0;
  const hasSanityMainBio = (about?.mainBio?.length ?? 0) > 0;
  const chronology =
    about?.chronology && about.chronology.length > 0
      ? about.chronology
      : seed.chronology;

  return (
    <div className="pt-32 pb-24">
      {/* ── Hero: Centered Statement ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-32">
        <div className="max-w-5xl mx-auto text-center py-16 md:py-24">
          <span className="text-primary opacity-60 tracking-[0.2em] uppercase mb-6 block font-label text-xs">
            The Narrative
          </span>
          <h1 className="font-serif-brand text-6xl md:text-8xl font-light leading-tight text-on-surface tracking-tighter italic">
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* ── Biography: The Archival Folder ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          {/* Sticky Portrait */}
          <div className="md:col-span-5">
            <div className="sticky top-40">
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden rounded-lg relative">
                <Image
                  src={
                    hasSanityImage
                      ? urlFor(about!.profileImage!).width(800).height(1000).url()
                      : seed.portraitUrl
                  }
                  alt="Portrait of Salim Dada"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover grayscale opacity-90 contrast-[1.1]"
                  priority
                />
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-[1px] w-12 bg-outline-variant/30" />
                <span className="font-label text-[10px] uppercase tracking-widest text-primary">
                  Biographical Archive 001
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
            A Chronology of Precision
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/15 md:-translate-x-px" />

          <div className="space-y-0">
            {chronology.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={`${item.year}-${i}`}
                  className="relative grid grid-cols-1 md:grid-cols-2"
                >
                  {/* ── Dot on the centre line ── */}
                  <div className="absolute left-4 md:left-1/2 top-4 md:top-5 w-[7px] h-[7px] -translate-x-[3px] md:-translate-x-[3.5px] rounded-full bg-primary/25 ring-[3px] ring-surface z-10" />

                  {/* ── LEFT column ── */}
                  <div
                    className={`pl-12 md:pl-0 ${
                      isLeft
                        ? "md:pr-16 md:text-right"
                        : "md:pr-16 md:text-right md:order-1"
                    } pb-8 md:pb-12`}
                  >
                    {isLeft ? (
                      <>
                        <div className="hidden md:flex justify-end mb-3">
                          <div className="w-10 h-px bg-primary/15" />
                        </div>
                        <div className="w-10 h-px bg-primary/15 mb-3 md:hidden" />
                        <span className="font-serif-brand text-2xl md:text-3xl text-primary/30 block mb-2">
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
                    } pb-12`}
                  >
                    {!isLeft && (
                      <>
                        <div className="w-10 h-px bg-primary/15 mb-3" />
                        <span className="font-serif-brand text-2xl md:text-3xl text-primary/30 block mb-2">
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
                    <div className="md:hidden pl-12 pb-8">
                      <div className="w-10 h-px bg-primary/15 mb-3" />
                      <span className="font-serif-brand text-2xl text-primary/30 block mb-2">
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

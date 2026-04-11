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

interface AboutData {
  profileImage?: SanityImageSource;
  bio?: PortableTextBlock[];
  mainBio?: PortableTextBlock[];
  shortIntro?: string;
  pullQuote?: string;
  achievements?: string[];
  philosophy?: string;
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
  achievements: [
    "Resident Composer, Orchestre Symphonique National (2012)",
    "UNESCO ICH Expert \u2014 International Committee for the Safeguarding of Intangible Cultural Heritage (2018)",
    "Global Merit Award for musical diplomacy and archival science (2023)",
    "Committee governance for evaluation of cultural assets across North Africa",
    "Led documentation projects translating endangered auditory heritage into modern notation",
  ],
  philosophy:
    "I believe that every culture possesses a \u201csilent rhythm\u201d \u2014 a pulse that dictates its movement through history. My role is to listen to that silence until it becomes a note.",
  philosophyImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBI1LvBLWn5oWCm60ZKhC00uqz56akM9Qli2XyiNTHS0JmBwgulorSf9lE1yI_qdeyBY_WsZffQ9x2PanqOJcMZA1hy192ZH24nDeyyIzqY5wfaCnbS5SQuEFDiZ6sjKZ9m5OUj0PqiZgbdu6Knm-00yHl4PlM9RSfajyvPxfqULMYY45WJIQhe3s2ACPG9gRQnjzTrenEe-Ml5-z_j86kQgQN1GMA5-kPmQixazRVFoU-jI4ytJxGcVin3t8_IhM2Z0lGQYxqlPsg",
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

  const shortIntro = about?.shortIntro || seed.shortIntro;
  const pullQuote = about?.pullQuote || seed.pullQuote;
  const hasSanityImage = !!about?.profileImage;
  const hasSanityBio = (about?.bio?.length ?? 0) > 0;
  const hasSanityMainBio = (about?.mainBio?.length ?? 0) > 0;
  const achievements =
    about?.achievements && about.achievements.length > 0
      ? about.achievements
      : seed.achievements;
  const philosophy = about?.philosophy || seed.philosophy;

  return (
    <div className="pt-32 pb-24">
      {/* ── Hero: Editorial Asymmetry ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <span className="text-primary opacity-60 tracking-[0.2em] uppercase mb-4 block font-label text-xs">
              The Narrative
            </span>
            <h1 className="font-serif-brand text-6xl md:text-8xl font-light leading-tight text-on-surface tracking-tighter">
              Between <br />
              <span className="italic pl-12 md:pl-24">
                Silence &amp; Sound.
              </span>
            </h1>
          </div>
          <div className="md:col-span-4 pb-4">
            <p className="text-on-surface-variant font-body leading-relaxed max-w-sm">
              {shortIntro}
            </p>
          </div>
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
              <h2 className="font-serif-brand text-3xl mb-12 text-on-surface">
                The Orchestration of History
              </h2>

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

      {/* ── Achievements & UNESCO ── */}
      <section className="bg-surface-container-low py-32 px-6 md:px-12 mb-48">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h3 className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-6">
                Global Stewardship
              </h3>
              <h2 className="font-serif-brand text-4xl leading-snug text-on-surface">
                Achievements &amp; Cultural Heritage
              </h2>
            </div>
            <div className="md:w-2/3">
              <ul className="space-y-6">
                {achievements.map((item, i) => (
                  <li key={i} className="flex items-start gap-5 group">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/30 shrink-0" />
                    <p className="font-headline text-[1.05rem] leading-relaxed text-on-surface-variant/70">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collaborative Philosophy ── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 mb-32">
        <div className="bg-surface-container-highest p-12 md:p-24 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative aspect-[4/3]">
            <Image
              src={seed.philosophyImageUrl}
              alt="Hand-written musical score with complex notations on aged paper"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale brightness-95"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-serif-brand text-3xl mb-8">
              The Philosophy of the Score
            </h3>
            <p className="font-headline text-[1.05rem] md:text-lg leading-[2] text-on-surface-variant/70 mb-8">
              {philosophy}
            </p>
            <a
              href="/media"
              className="inline-flex items-center gap-4 group"
            >
              <span className="font-label text-xs uppercase tracking-widest border-b border-on-surface pb-1">
                View Archive of Works
              </span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-2">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

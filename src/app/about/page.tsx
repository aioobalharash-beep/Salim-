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
};

// Static content not managed in Sanity
const unescoCards = [
  {
    icon: "account_balance",
    title: "Committee Governance",
    description:
      "Serving as a pivotal voice in the evaluation of cultural assets, ensuring the preservation of oral traditions and performing arts across North Africa.",
  },
  {
    icon: "history_edu",
    title: "Scholarly Missions",
    description:
      "Leading documentation projects that translate endangered auditory heritages into modern notation for future generations of scholars and performers.",
  },
];

const milestones = [
  {
    year: "2012",
    title: "Orchestre Symphonique National",
    description:
      "Appointed as Resident Composer, premiering 'The Symphony of Sand' to international acclaim.",
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
];

export default async function AboutPage() {
  let about: { profileImage?: SanityImageSource; bio?: PortableTextBlock[]; shortIntro?: string; pullQuote?: string } | null = null;

  try {
    about = await client.fetch(aboutQuery);
  } catch {
    // Sanity unavailable — use seed data
  }

  const shortIntro = about?.shortIntro || seed.shortIntro;
  const pullQuote = about?.pullQuote || seed.pullQuote;
  const hasSanityImage = !!about?.profileImage;
  const hasSanityBio = (about?.bio?.length ?? 0) > 0;

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
                <div className="space-y-8 text-lg font-body leading-relaxed text-on-surface-variant">
                  <PortableText
                    value={about!.bio!}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="mb-8">{children}</p>
                        ),
                        h2: ({ children }) => (
                          <h2 className="font-serif-brand text-2xl mt-12 mb-6 text-on-surface">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="font-serif-brand text-xl mt-10 mb-4 text-on-surface">
                            {children}
                          </h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="italic text-primary border-l-2 border-primary-container pl-8 py-2">
                            {children}
                          </blockquote>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <strong className="font-medium text-on-surface">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="text-on-surface/70">{children}</em>
                        ),
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-8 text-lg font-body leading-relaxed text-on-surface-variant">
                  {seed.biographyParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              <p className="italic text-primary border-l-2 border-primary-container pl-8 py-2 mt-8">
                &ldquo;{pullQuote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNESCO Involvement ── */}
      <section className="bg-surface-container-low py-32 px-6 md:px-12 mb-48">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h3 className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-6">
                Global Stewardship
              </h3>
              <h2 className="font-serif-brand text-4xl leading-snug text-on-surface">
                UNESCO &amp; The Protection of Intangible Heritage
              </h2>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {unescoCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-surface p-10 rounded-lg shadow-card border border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-primary mb-6 block">
                    {card.icon}
                  </span>
                  <h4 className="font-label text-sm font-bold uppercase tracking-wider mb-4">
                    {card.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Milestones: Timeline ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-48">
        <div className="mb-24 text-center">
          <h2 className="font-serif-brand text-4xl italic">
            A Chronology of Precision
          </h2>
        </div>
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-outline-variant/20 md:-translate-x-1/2" />

          <div className="space-y-32">
            {milestones.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={item.year}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24"
                >
                  {/* Year */}
                  <div className={isEven ? "md:text-right" : "md:order-2"}>
                    <span className="font-serif-brand text-3xl text-primary-dim">
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`relative pl-8 md:pl-0 ${
                      !isEven ? "md:text-right" : ""
                    }`}
                  >
                    <div
                      className={`absolute top-4 w-6 h-[1px] bg-primary ${
                        isEven
                          ? "left-0 md:-left-[13px]"
                          : "left-0 md:left-auto md:-right-[13px]"
                      }`}
                    />
                    <h4 className="font-label text-xs uppercase tracking-widest text-on-surface font-bold mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Collaborative Philosophy ── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 mb-32">
        <div className="bg-surface-container-highest p-12 md:p-24 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative aspect-[4/3]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI1LvBLWn5oWCm60ZKhC00uqz56akM9Qli2XyiNTHS0JmBwgulorSf9lE1yI_qdeyBY_WsZffQ9x2PanqOJcMZA1hy192ZH24nDeyyIzqY5wfaCnbS5SQuEFDiZ6sjKZ9m5OUj0PqiZgbdu6Knm-00yHl4PlM9RSfajyvPxfqULMYY45WJIQhe3s2ACPG9gRQnjzTrenEe-Ml5-z_j86kQgQN1GMA5-kPmQixazRVFoU-jI4ytJxGcVin3t8_IhM2Z0lGQYxqlPsg"
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
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              I believe that every culture possesses a &ldquo;silent
              rhythm&rdquo; &mdash; a pulse that dictates its movement through
              history. My role is to listen to that silence until it becomes a
              note.
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

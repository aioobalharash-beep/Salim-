import type { Metadata } from "next";
import Image from "next/image";
import { kvGet } from "@/lib/kv";

export const metadata: Metadata = {
  title: "About Salim — Salim Dada",
  description:
    "The narrative of Salim Dada: composer, conductor, musicologist, and UNESCO cultural envoy bridging silence and sound across the Mediterranean.",
};

interface AboutData {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  portraitUrl: string;
  portraitAlt: string;
  biographyTitle: string;
  biographyParagraphs: string[];
  pullQuote: string;
  unescoCards: { icon: string; title: string; description: string }[];
  milestones: { year: string; title: string; description: string }[];
  philosophyTitle: string;
  philosophyText: string;
  philosophyImageUrl: string;
  philosophyImageAlt: string;
}

async function getAboutData(): Promise<AboutData> {
  return kvGet<AboutData>("about");
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <div className="pt-32 pb-24">
      {/* ── Hero: Editorial Asymmetry ── */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <span className="text-primary opacity-60 tracking-[0.2em] uppercase mb-4 block font-label text-xs">
              {data.heroTag}
            </span>
            <h1 className="font-serif-brand text-6xl md:text-8xl font-light leading-tight text-on-surface tracking-tighter">
              Between <br />
              <span className="italic pl-12 md:pl-24">Silence &amp; Sound.</span>
            </h1>
          </div>
          <div className="md:col-span-4 pb-4">
            <p className="text-on-surface-variant font-body leading-relaxed max-w-sm">
              {data.heroSubtitle}
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
                  src={data.portraitUrl}
                  alt={data.portraitAlt}
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
                {data.biographyTitle}
              </h2>
              <div className="space-y-8 text-lg font-body leading-relaxed text-on-surface-variant">
                {data.biographyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p className="italic text-primary border-l-2 border-primary-container pl-8 py-2">
                  &ldquo;{data.pullQuote}&rdquo;
                </p>
              </div>
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
              {data.unescoCards.map((card) => (
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
            {data.milestones.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={item.year}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24"
                >
                  {/* Year */}
                  <div
                    className={isEven ? "md:text-right" : "md:order-2"}
                  >
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
              src={data.philosophyImageUrl}
              alt={data.philosophyImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale brightness-95"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-serif-brand text-3xl mb-8">
              {data.philosophyTitle}
            </h3>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              {data.philosophyText}
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

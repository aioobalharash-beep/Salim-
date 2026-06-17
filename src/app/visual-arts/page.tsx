import type { Metadata } from "next";

const TITLE = "Visual Arts";
const DESCRIPTION =
  "Salim Dada's visual practice — a curated companion to the music: imagery, design, and exhibition work.";

export const metadata: Metadata = {
  title: `${TITLE} — Salim Dada`,
  description: DESCRIPTION,
};

// Placeholder lander for the new top-level Visual Arts route. Gives the navbar
// link a real destination ahead of the dedicated gallery/exhibition content.
export default function VisualArtsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <section className="max-w-6xl mx-auto px-6 md:px-8 mb-12 md:mb-16">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-5">
          Beyond the Score
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-light text-foreground leading-[1.1] mb-6">
          {TITLE}
        </h1>
        <p className="font-body text-base leading-relaxed text-foreground/55 max-w-2xl">
          {DESCRIPTION}
        </p>
      </section>
    </div>
  );
}

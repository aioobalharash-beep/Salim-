import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Training — Salim Dada",
  description:
    "Advanced masterclasses for orchestral conductors and soloists with Salim Dada.",
};

const masterclasses = [
  {
    title: "Orchestral Conducting Intensive",
    duration: "5 days",
    description:
      "A rigorous exploration of baton technique, score analysis, and rehearsal methodology for emerging conductors seeking interpretive maturity.",
    icon: "music_note",
  },
  {
    title: "Guitar Interpretation Workshop",
    duration: "3 days",
    description:
      "Deep study of Mediterranean and North African guitar repertoire, focusing on tonal colour, microtonal sensitivity, and historical context.",
    icon: "piano",
  },
  {
    title: "Composition Seminar",
    duration: "4 days",
    description:
      "A collaborative seminar on blending Western classical form with Maghrebi melodic traditions, covering orchestration, counterpoint, and sonic storytelling.",
    icon: "edit_note",
  },
  {
    title: "Cultural Musicology Lecture Series",
    duration: "2 days",
    description:
      "An academic programme exploring the migration of musical scales across the Mediterranean, combining archival research with live demonstration.",
    icon: "school",
  },
];

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        tag="Pedagogy"
        title="Training & Masterclasses"
        description="Advanced masterclasses for orchestral conductors and soloists focusing on interpretive emotional depth, precision, and the rich intersection of Mediterranean musical traditions."
      />

      {/* Hero Image */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24">
        <div className="aspect-[21/9] w-full overflow-hidden rounded relative">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI"
            alt="Concert hall with warm wooden architecture set for an orchestral masterclass"
            fill
            sizes="100vw"
            className="object-cover grayscale brightness-90"
            priority
          />
        </div>
      </section>

      {/* Masterclass Grid */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-collapse">
          {masterclasses.map((item) => (
            <div
              key={item.title}
              className="p-12 border border-outline-variant/15 hover:bg-surface-container-low transition-colors duration-500 flex flex-col min-h-[320px]"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {item.icon}
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                  {item.duration}
                </span>
              </div>
              <h4 className="font-serif-brand text-2xl mb-4">{item.title}</h4>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant flex-grow">
                {item.description}
              </p>
              <a
                href="/#inquiry"
                className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block"
              >
                Register Interest{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

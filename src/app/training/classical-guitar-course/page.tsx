import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Classical Guitar Interpretation — Salim Dada",
  description:
    "A 3-day intensive workshop on Mediterranean and North African guitar repertoire with Salim Dada.",
};

const curriculum = [
  {
    day: "Day 1",
    title: "Foundations of Mediterranean Tonality",
    topics: [
      "Historical survey of the classical guitar in North Africa",
      "Microtonal sensitivity and maqam-based improvisation",
      "Listening workshop: recordings from the Casbah archives",
    ],
  },
  {
    day: "Day 2",
    title: "Technique & Interpretation",
    topics: [
      "Right-hand tonal colour — nails, flesh, and angle",
      "Ornamental vocabulary: mordents, trills, and grace notes in Andalusian tradition",
      "Masterclass: individual performance and critique",
    ],
  },
  {
    day: "Day 3",
    title: "Performance & Integration",
    topics: [
      "Constructing a programme that bridges East and West",
      "Stage presence and the philosophy of silence in performance",
      "Final recital with peer and instructor feedback",
    ],
  },
];

export default function GuitarCoursePage() {
  return (
    <div className="pt-40 pb-32">
      {/* Hero */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-7">
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
              3-Day Intensive
            </p>
            <h1 className="font-headline text-5xl md:text-6xl font-light mb-8 text-on-surface">
              Classical Guitar Interpretation
            </h1>
            <p className="font-body text-base leading-relaxed text-on-surface-variant max-w-xl mb-10">
              A rigorous exploration of Mediterranean and North African guitar
              repertoire, focusing on tonal colour, microtonal sensitivity, and
              the living traditions that connect Algiers to Andalusia.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/#enquiry-section"
                className="px-10 py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
              >
                Apply Now
              </a>
              <Link
                href="/training"
                className="px-10 py-4 border border-outline-variant/20 text-on-surface font-label text-[11px] uppercase tracking-[0.2em] hover:bg-surface-container-low transition-colors"
              >
                All Programmes
              </Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="aspect-[4/5] w-full overflow-hidden relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHngzL3XRvwLGEq3kAA5M_ifSIrq51cHFfStHHjZhfsQqlaa8zqHuaGOfHL4CrVA5yWWCHAgi6QHyU4Z6F9gAxK7Y50MJyRxozrIXUKpjYskHboJKudNZexudXemgaxY8BbEAKIfCkZVqDjSGm_Z9t-rvC-5EZmJzGpM9WD-hwnG3VQZpWbcsHtWfNIxFiOcpDE2UvH3VZMnjb9mM_6i4_JRuf4F7FCyGqRVLG1Dh4E61lOxGgDs5b0St23WuOm9COjICQWN3eCKM"
                alt="Close up of hands playing a classical acoustic guitar"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover grayscale brightness-90"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-24">
        <div className="mb-16">
          <h2 className="font-headline text-3xl font-light mb-4">Curriculum</h2>
          <div className="w-16 h-[1px] bg-primary/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-collapse">
          {curriculum.map((day) => (
            <div
              key={day.day}
              className="p-10 border border-outline-variant/15 flex flex-col"
            >
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-3">
                {day.day}
              </p>
              <h3 className="font-serif-brand text-xl mb-6 text-on-surface">
                {day.title}
              </h3>
              <ul className="space-y-4 flex-grow">
                {day.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 text-sm text-on-surface-variant leading-relaxed"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 mt-2 shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="bg-surface-container-low p-12 md:p-16 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
            Limited Enrolment
          </p>
          <h3 className="font-headline text-3xl font-light mb-6">
            Ready to Begin?
          </h3>
          <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto mb-10">
            Places are limited to ensure individual attention. Submit an inquiry
            to reserve your position in the next session.
          </p>
          <a
            href="/#enquiry-section"
            className="inline-block px-12 py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
          >
            Submit Inquiry
          </a>
        </div>
      </section>
    </div>
  );
}

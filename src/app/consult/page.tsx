import type { Metadata } from "next";

// Hidden, shareable consultation lander. Salim sends this link directly to
// private students and elite prospects, so it is kept out of search indexes
// (mirroring the "unindexed, high-converting landers" note in Services). The
// global Navbar + Footer come from PublicShell, so the route feels native to
// the main domain.
export const metadata: Metadata = {
  title: "Free 20-Minute Written Work Consultation — Salim Dada",
  description:
    "Submit your emerging compositions, scores, or project details for a direct professional review and live strategic breakdown with Salim Dada.",
  robots: { index: false, follow: false },
};

export default function ConsultPage() {
  return (
    <div className="pt-32 pb-24 md:pb-32">
      <div className="max-w-4xl mx-auto w-full px-6 md:px-12">
        {/* Centered serif header + standard value pitch. */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-serif-brand text-3xl md:text-4xl lg:text-5xl tracking-tight font-light text-on-surface mb-4">
            Free 20-Minute Written Work Consultation
          </h1>
          <p className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl mx-auto">
            Submit your emerging compositions, scores, or project details for a
            direct professional review and live strategic breakdown with Salim
            Dada.
          </p>
        </div>

        {/* Fully visible inline Tally form — spacious, eager-loaded. */}
        <div className="bg-[#faf8f5] rounded-sm shadow-2xl p-8 md:p-12">
          <iframe
            src="https://tally.so/embed/dWz4jo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            title="Free 20-Minute Written Work Consultation"
            loading="eager"
            className="w-full h-[720px] border-0 overflow-y-auto bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

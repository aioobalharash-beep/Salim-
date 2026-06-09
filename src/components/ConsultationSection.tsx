// Free written-work consultation lead capture. The Tally intake form is
// embedded inline (no button, no modal) so the fields render alongside the
// rest of the homepage and load eagerly. The wrapper matches the global page
// margins and compresses its vertical rhythm on mobile to keep the scroll
// path tight.
export default function ConsultationSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-20">
      {/* Section introduction — left-aligned serif header + value pitch. */}
      <div className="mb-8 md:mb-12 max-w-2xl">
        <h2 className="font-serif-brand text-3xl md:text-4xl font-light text-left">
          Free 15-Minute Written Work Consultation
        </h2>
        <p className="font-body text-base leading-relaxed text-on-surface-variant mt-4">
          Submit your emerging compositions, scores, or project details for a
          direct professional review and live strategic breakdown with Salim
          Dada.
        </p>
      </div>

      {/* Seamless in-line Tally embed — styled to read as native page content. */}
      <iframe
        src="https://tally.so/embed/dWz4jo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        title="Free 15-Minute Written Work Consultation"
        loading="eager"
        className="w-full min-h-[600px] border-0 bg-transparent"
      />
    </section>
  );
}

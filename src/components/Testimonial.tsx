export default function Testimonial() {
  return (
    <section className="py-48 px-6 md:px-12 max-w-4xl mx-auto text-center">
      <span className="material-symbols-outlined text-primary/40 text-5xl mb-12 block">
        format_quote
      </span>

      <blockquote className="font-serif-brand italic text-3xl md:text-4xl text-on-surface leading-snug mb-12 hanging-punctuation">
        &ldquo;Salim Dada possesses that rare duality of a scientist&rsquo;s
        rigor and a poet&rsquo;s heart. His ability to transcribe the unwritten
        histories of Mediterranean music is nothing short of alchemy.&rdquo;
      </blockquote>

      <div className="w-12 h-[1px] bg-primary/40 mx-auto mb-6" />

      <p className="font-label text-xs tracking-widest uppercase">
        Director of Cultural Affairs, UNESCO
      </p>
    </section>
  );
}

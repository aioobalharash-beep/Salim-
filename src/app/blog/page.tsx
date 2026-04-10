import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Essays — Salim Dada",
  description:
    "Long-form essays on musicology, cultural preservation, and the intersection of East and West by Salim Dada.",
};

const essays = [
  {
    date: "October 2024",
    title: "On the Disappearance of the Andalusian Nouba",
    excerpt:
      "The nouba, a multi-movement suite that once defined the sonic landscape of North Africa, is fading from living performance. This essay traces its decline and argues for a new approach to preservation.",
    readTime: "12 min read",
  },
  {
    date: "August 2024",
    title: "Silence as Structure: Negative Space in Orchestral Conducting",
    excerpt:
      "What happens between the notes matters more than the notes themselves. An exploration of how the great conductors used silence as an architectural element.",
    readTime: "8 min read",
  },
  {
    date: "May 2024",
    title: "The Luthier's Hand: Craftsmanship and Memory in the Maghreb",
    excerpt:
      "Documenting the last generation of traditional oud makers in Algeria and Tunisia — their methods, philosophies, and the threat of industrial replacement.",
    readTime: "15 min read",
  },
  {
    date: "February 2024",
    title: "Microtonal Bridges: How the Sahel Shaped European Harmony",
    excerpt:
      "A musicological argument for the overlooked influence of sub-Saharan tonal systems on the development of early European polyphony, traced through trade routes and manuscript evidence.",
    readTime: "18 min read",
  },
  {
    date: "November 2023",
    title: "Teaching Without Words: The Oral Tradition in Guitar Pedagogy",
    excerpt:
      "Before conservatories, the guitar was taught hand-to-hand, ear-to-ear. This essay reflects on what has been lost — and what can be reclaimed — in our approach to musical education.",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHeader
        tag="Writings"
        title="Essays"
        description="Long-form reflections on musicology, cultural preservation, pedagogy, and the invisible threads connecting Mediterranean musical traditions."
      />

      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <div className="max-w-3xl">
          {essays.map((essay, i) => (
            <article
              key={essay.title}
              className={`py-12 ${i < essays.length - 1 ? "border-b border-outline-variant/15" : ""} group cursor-pointer`}
            >
              <div className="flex items-center gap-4 mb-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                  {essay.date}
                </p>
                <span className="text-outline-variant/30">&middot;</span>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                  {essay.readTime}
                </p>
              </div>
              <h4 className="font-serif-brand text-2xl mb-4 group-hover:text-primary transition-colors duration-300">
                {essay.title}
              </h4>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                {essay.excerpt}
              </p>
              <span className="font-label text-[10px] uppercase tracking-widest text-primary group-hover:tracking-[0.2em] mt-6 inline-block transition-all duration-300">
                Read Essay{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

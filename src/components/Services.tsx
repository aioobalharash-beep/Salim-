const services = [
  {
    icon: "school",
    title: "Training",
    description:
      "Advanced masterclasses for orchestral conductors and soloists focusing on interpretive emotional depth and precision.",
    cta: { label: "Learn More", href: "/training" },
  },
  {
    icon: "edit_note",
    title: "Composition",
    description:
      "Bespoke commissions for cinematic scores, theatrical performances, and chamber ensembles bridging East and West.",
    cta: { label: "Commission", href: "/#inquiry" },
  },
  {
    icon: "forum",
    title: "Consulting",
    description:
      "Strategic artistic direction for international festivals and cultural institutions looking to redefine their identity.",
    cta: { label: "Consult", href: "/#inquiry" },
  },
  {
    icon: "public",
    title: "Cultural Expertise",
    description:
      "Preservation strategies and advisory for UNESCO-listed musical heritages and archival digitization projects.",
    cta: { label: "Expertise", href: "/#inquiry" },
  },
];

export default function Services() {
  return (
    <section className="py-32 bg-surface-container-low">
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
            Professional Offering
          </p>
          <h3 className="font-headline text-4xl font-light">
            The Practice of Excellence
          </h3>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-collapse">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-12 border border-outline-variant/15 hover:bg-surface transition-colors duration-500 flex flex-col min-h-[400px]"
            >
              <span className="material-symbols-outlined text-primary mb-8 text-3xl">
                {service.icon}
              </span>
              <h4 className="font-serif-brand text-2xl mb-6">
                {service.title}
              </h4>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant flex-grow">
                {service.description}
              </p>
              <a
                href={service.cta.href}
                className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block"
              >
                {service.cta.label}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

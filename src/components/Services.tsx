import Link from "next/link";

interface ServiceItem {
  _id: string;
  title: string;
  icon?: string;
  description?: string;
  duration?: string;
  ctaLabel?: string;
  ctaLink?: string;
  action?: string;
  // Dedicated high-converting landing page for this offering. Every card now
  // routes the visitor straight here via a hard link (see CTA below).
  href?: string;
}

// Static offering data. These four cards are the canonical B2B offering and
// take over from any legacy Sanity entries (see resolution in the component).
// Keep the minimalist typography + single Material Symbol per card intact.
// Each card links directly to its individual /services/<slug> landing page.
const seedServices: ServiceItem[] = [
  {
    _id: "service-music-composition",
    title: "Music Composition",
    icon: "music_note",
    description:
      "Custom commissions for orchestra, ensemble, soloist, film, opera, theatre, ballet, and large-scale cultural events — original works tailored to your artistic vision and production requirements.",
    href: "/services/music-composition",
  },
  {
    _id: "service-composer-program",
    title: "Composer Program",
    icon: "school",
    description:
      "Mentorship and professional support for advanced and emerging composers — from score editing to orchestral recording — drawing on 30 years of international compositional practice.",
    href: "/services/composer-program",
  },
  {
    _id: "service-artistic-direction",
    title: "Artistic Direction",
    icon: "theater_comedy",
    description:
      "Strategic and creative leadership for international festivals, cultural institutions, and mega shows — from concept development to full project management.",
    href: "/services/artistic-direction",
  },
  {
    _id: "service-cultural-expertise",
    title: "Cultural Expertise",
    icon: "public",
    description:
      "Advisory, capacity building and technical reports on cultural diversity, cultural policies, creative industries, artists' condition, and the impact of digital technologies and AI on culture.",
    href: "/services/cultural-expertise",
  },
];

export default function Services({ items }: { items: ServiceItem[] }) {
  // The static offering is authoritative; legacy Sanity entries are a fallback
  // only if the array above is somehow emptied.
  const services = seedServices.length > 0 ? seedServices : items;

  return (
    <section className="py-12 md:py-32 bg-surface-container-low">
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 text-center">
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
              key={service._id}
              className="p-12 border border-outline-variant/15 hover:bg-surface transition-colors duration-500 flex flex-col min-h-[400px]"
            >
              {service.icon && (
                <span className="material-symbols-outlined text-primary mb-8 text-3xl">
                  {service.icon}
                </span>
              )}
              <h4 className="font-serif-brand text-2xl mb-6">
                {service.title}
              </h4>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant flex-grow">
                {service.description}
              </p>

              {/* CTA — routes directly to this offering's dedicated landing
                  page. `flex-grow` on the description above pushes it to the
                  bottom of the card; `mt-8` + the card's left padding keep it
                  anchored bottom-left, flush with the description's left edge. */}
              <Link
                href={service.href ?? "/services"}
                className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-flex items-center gap-1 self-start"
              >
                Read more
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import LeadCaptureModal from "./LeadCaptureModal";

const services = [
  {
    icon: "school",
    title: "Training",
    description:
      "Advanced masterclasses for orchestral conductors and soloists focusing on interpretive emotional depth and precision.",
    cta: { label: "Guitar Course", href: "/training/classical-guitar-course" },
    action: "link" as const,
  },
  {
    icon: "edit_note",
    title: "Composition",
    description:
      "Bespoke commissions for cinematic scores, theatrical performances, and chamber ensembles bridging East and West.",
    cta: { label: "Enquire", href: "/#enquiry-section" },
    action: "link" as const,
  },
  {
    icon: "forum",
    title: "Consulting",
    description:
      "A complimentary 15-minute introductory session to explore your artistic vision and how we might collaborate.",
    cta: { label: "Book Free Session", href: "" },
    action: "modal" as const,
  },
  {
    icon: "public",
    title: "Full Consulting",
    description:
      "Comprehensive artistic direction for international festivals, cultural institutions, and heritage preservation projects.",
    cta: { label: "Begin Engagement", href: "/training/full-consulting" },
    action: "link" as const,
  },
];

export default function Services() {
  const [modalOpen, setModalOpen] = useState(false);

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

              {service.action === "modal" ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block text-left"
                >
                  {service.cta.label}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              ) : (
                <a
                  href={service.cta.href}
                  className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block"
                >
                  {service.cta.label}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <LeadCaptureModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

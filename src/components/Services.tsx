"use client";

import { useState } from "react";
import LeadCaptureModal from "./LeadCaptureModal";

interface ServiceItem {
  _id: string;
  title: string;
  icon?: string;
  description?: string;
  duration?: string;
  ctaLabel?: string;
  ctaLink?: string;
  action?: string;
}

// Seed data used when Sanity has no services
const seedServices: ServiceItem[] = [
  {
    _id: "seed-1",
    title: "Training",
    icon: "school",
    description:
      "Advanced masterclasses for orchestral conductors and soloists focusing on interpretive emotional depth and precision.",
    ctaLabel: "Guitar Course",
    ctaLink: "/training/classical-guitar-course",
    action: "link",
  },
  {
    _id: "seed-2",
    title: "Composition",
    icon: "edit_note",
    description:
      "Bespoke commissions for cinematic scores, theatrical performances, and chamber ensembles bridging East and West.",
    ctaLabel: "Enquire",
    ctaLink: "/#enquiry-section",
    action: "link",
  },
  {
    _id: "seed-3",
    title: "Consulting",
    icon: "forum",
    description:
      "A complimentary 15-minute introductory session to explore your artistic vision and how we might collaborate.",
    ctaLabel: "Book Free Session",
    action: "modal",
  },
  {
    _id: "seed-4",
    title: "Full Consulting",
    icon: "public",
    description:
      "Comprehensive artistic direction for international festivals, cultural institutions, and heritage preservation projects.",
    ctaLabel: "Begin Engagement",
    ctaLink: "/training/full-consulting",
    action: "link",
  },
];

export default function Services({ items }: { items: ServiceItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const services = items.length > 0 ? items : seedServices;

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

              {service.action === "modal" ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block text-left"
                >
                  {service.ctaLabel || "Enquire"}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              ) : (
                <a
                  href={service.ctaLink || "#"}
                  className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block"
                >
                  {service.ctaLabel || "Learn More"}{" "}
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

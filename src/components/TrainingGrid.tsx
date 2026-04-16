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

const seedServices: ServiceItem[] = [
  {
    _id: "seed-1",
    title: "Classical Guitar Interpretation",
    icon: "piano",
    description:
      "Deep study of Mediterranean and North African guitar repertoire, focusing on tonal colour, microtonal sensitivity, and historical context.",
    duration: "3 days",
    ctaLabel: "View Course",
    ctaLink: "/training/classical-guitar-course",
    action: "link",
  },
  {
    _id: "seed-2",
    title: "Composition Tutoring",
    icon: "edit_note",
    description:
      "A collaborative seminar on blending Western classical form with Maghrebi melodic traditions, covering orchestration, counterpoint, and sonic storytelling.",
    duration: "4 days",
    ctaLabel: "Enquire",
    ctaLink: "/#enquiry-section",
    action: "link",
  },
  {
    _id: "seed-3",
    title: "Free 15-Min Consultation",
    icon: "forum",
    description:
      "A complimentary introductory session to explore your artistic vision, discuss your goals, and understand how we might collaborate.",
    duration: "15 min",
    ctaLabel: "Reserve Session",
    action: "modal",
  },
  {
    _id: "seed-4",
    title: "Full Consulting Engagement",
    icon: "workspace_premium",
    description:
      "Comprehensive artistic direction for international festivals, cultural institutions, and heritage preservation projects. Bespoke pricing.",
    duration: "Ongoing",
    ctaLabel: "Begin Engagement",
    ctaLink: "/training/full-consulting",
    action: "link",
  },
];

export default function TrainingGrid({ items }: { items: ServiceItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const services = items.length > 0 ? items : seedServices;

  return (
    <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-collapse">
        {services.map((item) => (
          <div
            key={item._id}
            className="p-12 border border-outline-variant/15 hover:bg-surface-container-low transition-colors duration-500 flex flex-col min-h-[320px]"
          >
            <div className="flex items-center justify-between mb-8">
              {item.icon && (
                <span className="material-symbols-outlined text-primary text-3xl">
                  {item.icon}
                </span>
              )}
              {item.duration && (
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                  {item.duration}
                </span>
              )}
            </div>
            <h4 className="font-serif-brand text-2xl mb-4">{item.title}</h4>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant flex-grow">
              {item.description}
            </p>

            {item.action === "modal" ? (
              <button
                onClick={() => setModalOpen(true)}
                className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block text-left"
              >
                {item.ctaLabel || "Enquire"}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            ) : (
              <a
                href={item.ctaLink || "#"}
                className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block"
              >
                {item.ctaLabel || "Learn More"}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            )}
          </div>
        ))}
      </div>

      <LeadCaptureModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

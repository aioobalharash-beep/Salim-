"use client";

import { useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import LeadCaptureModal from "@/components/LeadCaptureModal";

const masterclasses = [
  {
    title: "Classical Guitar Interpretation",
    duration: "3 days",
    description:
      "Deep study of Mediterranean and North African guitar repertoire, focusing on tonal colour, microtonal sensitivity, and historical context.",
    icon: "piano",
    cta: { label: "View Course", href: "/training/classical-guitar-course" },
    action: "link" as const,
  },
  {
    title: "Composition Tutoring",
    duration: "4 days",
    description:
      "A collaborative seminar on blending Western classical form with Maghrebi melodic traditions, covering orchestration, counterpoint, and sonic storytelling.",
    icon: "edit_note",
    cta: { label: "Enquire", href: "/#enquiry-section" },
    action: "link" as const,
  },
  {
    title: "Free 15-Min Consultation",
    duration: "15 min",
    description:
      "A complimentary introductory session to explore your artistic vision, discuss your goals, and understand how we might collaborate.",
    icon: "forum",
    cta: { label: "Reserve Session", href: "" },
    action: "modal" as const,
  },
  {
    title: "Full Consulting Engagement",
    duration: "Ongoing",
    description:
      "Comprehensive artistic direction for international festivals, cultural institutions, and heritage preservation projects. Bespoke pricing.",
    icon: "workspace_premium",
    cta: { label: "Begin Engagement", href: "/training/full-consulting" },
    action: "link" as const,
  },
];

export default function TrainingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        tag="Pedagogy"
        title="Training & Masterclasses"
        description="Advanced masterclasses for orchestral conductors and soloists focusing on interpretive emotional depth, precision, and the rich intersection of Mediterranean musical traditions."
      />

      {/* Hero Image */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24">
        <div className="aspect-[21/9] w-full overflow-hidden rounded relative">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI"
            alt="Concert hall with warm wooden architecture set for an orchestral masterclass"
            fill
            sizes="100vw"
            className="object-cover grayscale brightness-90"
            priority
          />
        </div>
      </section>

      {/* Masterclass Grid */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-collapse">
          {masterclasses.map((item) => (
            <div
              key={item.title}
              className="p-12 border border-outline-variant/15 hover:bg-surface-container-low transition-colors duration-500 flex flex-col min-h-[320px]"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {item.icon}
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                  {item.duration}
                </span>
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
                  {item.cta.label}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              ) : (
                <a
                  href={item.cta.href}
                  className="font-label text-[10px] uppercase tracking-widest text-primary group mt-8 inline-block"
                >
                  {item.cta.label}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <LeadCaptureModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

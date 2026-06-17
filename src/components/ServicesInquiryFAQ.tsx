"use client";

import { useState, useTransition } from "react";
import { sendInquiry } from "@/app/actions/inquiry";
import { INQUIRY_SUBJECTS } from "@/app/actions/inquirySubjects";

export interface FaqItem {
  _key: string;
  question: string;
  answer: string;
}

type Status = "idle" | "success" | "error";

/* ── Native inquiry input fields, copied from the homepage InquiryForm so the
      services hub shares one unified intake pipeline (sendInquiry). ──────── */
function InquiryPanel() {
  const [status, setStatus] = useState<Status>("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await sendInquiry(formData);
      setStatus(result.ok ? "success" : "error");
    });
  }

  return (
    <div>
      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
        Inquiries
      </p>
      <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-light mb-8">
        Start a Collaboration
      </h3>

      {status === "success" ? (
        <p
          role="status"
          aria-live="polite"
          className="font-headline text-xl sm:text-2xl font-light leading-snug text-on-surface"
        >
          Thank you. Your inquiry has been sent to the Maestro.
        </p>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="services-inquiry-name"
                className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
              >
                Full Name
              </label>
              <input
                id="services-inquiry-name"
                name="name"
                type="text"
                required
                className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="services-inquiry-email"
                className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
              >
                Email Address
              </label>
              <input
                id="services-inquiry-email"
                name="email"
                type="email"
                required
                className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="services-inquiry-subject"
              className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
            >
              Nature of Request
            </label>
            <div className="relative w-full">
              <select
                id="services-inquiry-subject"
                name="subject"
                required
                defaultValue={INQUIRY_SUBJECTS[0]}
                className="appearance-none cursor-pointer w-full bg-background border border-foreground/15 rounded-sm px-4 py-3 pr-10 font-body text-sm text-foreground outline-none focus:border-foreground focus:ring-0 transition-colors duration-200"
              >
                {INQUIRY_SUBJECTS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="services-inquiry-message"
              className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
            >
              Your Message
            </label>
            <textarea
              id="services-inquiry-message"
              name="message"
              required
              rows={4}
              className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all resize-none"
            />
          </div>

          {status === "error" && (
            <p
              role="alert"
              className="font-body text-sm text-[color:hsl(var(--destructive))]"
            >
              There was an issue sending your message. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto min-h-[48px] px-12 py-4 bg-primary text-on-primary font-serif-brand text-lg rounded-sm hover:opacity-90 transition-opacity uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending…" : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ── Collapsible FAQ accordion ────────────────────────────────────────── */
function FaqPanel({ faqs }: { faqs: FaqItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div>
      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
        Questions
      </p>
      <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-light mb-8">
        Frequently Asked
      </h3>

      <div className="divide-y divide-outline-variant/20 border-t border-outline-variant/20">
        {faqs.map((faq) => {
          const isOpen = openKey === faq._key;
          return (
            <div key={faq._key}>
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : faq._key)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-6 py-5 text-left group"
              >
                <span className="font-body text-base text-on-surface group-hover:text-primary transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`material-symbols-outlined text-primary text-[20px] shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  add
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100 pb-5"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ServicesInquiryFAQ({
  showInquiry,
  faqs,
}: {
  showInquiry: boolean;
  faqs: FaqItem[];
}) {
  const hasFaqs = faqs.length > 0;

  // Defensive: nothing authored on either side → render nothing.
  if (!showInquiry && !hasFaqs) return null;

  // Both present → balanced split panel. Only one present → it spans full width.
  const isSplit = showInquiry && hasFaqs;

  return (
    <section className="py-16 md:py-28 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <div
        className={`grid grid-cols-1 gap-12 md:gap-20 items-start ${
          isSplit ? "lg:grid-cols-2" : ""
        }`}
      >
        {showInquiry && <InquiryPanel />}
        {hasFaqs && <FaqPanel faqs={faqs} />}
      </div>
    </section>
  );
}

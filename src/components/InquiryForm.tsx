"use client";

import { useState, useTransition } from "react";
import { sendInquiry } from "@/app/actions/inquiry";
import { INQUIRY_SUBJECTS } from "@/app/actions/inquirySubjects";

type Status = "idle" | "success" | "error";

export default function InquiryForm() {
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
    <section
      id="enquiry-section"
      className="py-20 md:py-32 px-6 md:px-12 max-w-screen-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        {/* Left Column — Info */}
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
            Inquiries
          </p>
          <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-light mb-8 md:mb-12">
            Start a Collaboration
          </h3>
          <p className="font-body text-base leading-relaxed text-on-surface-variant max-w-md">
            Whether it is a new composition, a research project, or a
            pedagogical request, precision begins with a conversation.
          </p>
        </div>

        {/* Right Column — Form / Feedback */}
        {status === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center md:items-start"
          >
            <p className="font-headline text-2xl sm:text-3xl md:text-4xl font-light leading-snug text-on-surface">
              Thank you. Your inquiry has been sent to the Maestro.
            </p>
          </div>
        ) : (
          <form className="space-y-6 md:space-y-10" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="inquiry-name"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
                >
                  Full Name
                </label>
                <input
                  id="inquiry-name"
                  name="name"
                  type="text"
                  required
                  className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="inquiry-email"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
                >
                  Email Address
                </label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  required
                  className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="inquiry-subject"
                className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
              >
                Nature of Request
              </label>
              <div className="relative w-full">
                <select
                  id="inquiry-subject"
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
                {/* Custom minimalist chevron — bronze metadata tone */}
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
                htmlFor="inquiry-message"
                className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
              >
                Your Message
              </label>
              <textarea
                id="inquiry-message"
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
              className="w-full md:w-auto min-h-[48px] px-12 py-4 bg-primary text-on-primary font-serif-brand text-lg rounded-sm hover:opacity-90 transition-opacity uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending…" : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

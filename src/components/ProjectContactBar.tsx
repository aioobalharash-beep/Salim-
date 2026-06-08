"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { sendProjectEnquiry } from "@/app/actions/inquiry";

interface ProjectContactBarProps {
  /** The project title — the immutable subject of this enquiry. */
  projectTitle: string;
  /** Text rendered on the left of the bar. */
  text?: string | null;
  /** Label for the button on the right of the bar. */
  buttonLabel?: string | null;
}

type Status = "idle" | "success" | "error";

export default function ProjectContactBar({
  projectTitle,
  text,
  buttonLabel,
}: ProjectContactBarProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [isPending, startTransition] = useTransition();

  const label = buttonLabel?.trim() || "contact";

  // Escape-to-close + body scroll lock, mirroring ServiceEnquiryModal.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset feedback state each time the modal closes.
  useEffect(() => {
    if (!open) setStatus("idle");
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await sendProjectEnquiry(formData);
      setStatus(result.ok ? "success" : "error");
    });
  }

  return (
    <>
      {/* ── Full-width, high-contrast contact bar ── */}
      <section className="w-full py-6 px-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center bg-on-surface text-surface">
        {text && (
          <p className="font-headline text-lg md:text-xl font-light leading-snug text-surface text-center sm:text-left">
            {text}
          </p>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 inline-flex items-center justify-center px-8 py-3 border border-surface/30 text-surface font-label text-[11px] lowercase tracking-[0.25em] hover:bg-surface hover:text-on-surface transition-colors duration-300"
        >
          {label}
        </button>
      </section>

      {/* ── Enquiry Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Enquiry: ${projectTitle}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface shadow-card px-8 py-12 md:px-12"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-colors bg-surface/80 backdrop-blur-sm rounded-full"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              {status === "success" ? (
                <div role="status" aria-live="polite" className="text-center py-6">
                  <span className="material-symbols-outlined text-tertiary text-4xl mb-6 block">
                    check_circle
                  </span>
                  <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
                    Enquiry Sent
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
                    Thank you. Your enquiry regarding {projectTitle} has been
                    sent. You can expect a personal reply shortly.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="font-label text-[10px] uppercase tracking-[0.2em] text-primary hover:text-on-surface transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
                    Project Enquiry
                  </p>
                  <h3 className="font-serif-brand text-2xl md:text-3xl text-on-surface leading-tight mb-3">
                    {projectTitle}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10">
                    Share a few details and your message will reach Salim&apos;s
                    studio directly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                    {/* The subject is locked to this project and travels with
                        the form behind the scenes — never user-editable. */}
                    <input type="hidden" name="project" value={projectTitle} />

                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="project-enquiry-name"
                        className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
                      >
                        Full Name
                      </label>
                      <input
                        id="project-enquiry-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="project-enquiry-email"
                        className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
                      >
                        Email Address
                      </label>
                      <input
                        id="project-enquiry-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="project-enquiry-message"
                        className="font-label text-[10px] uppercase tracking-widest text-on-surface/50"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="project-enquiry-message"
                        name="message"
                        required
                        rows={4}
                        placeholder="Tell us about your project or collaboration..."
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p
                        role="alert"
                        className="font-body text-sm text-[color:hsl(var(--destructive))]"
                      >
                        There was an issue sending your enquiry. Please try
                        again.
                      </p>
                    )}

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center w-full max-w-xs py-3.5 bg-on-surface text-background font-label text-[11px] lowercase tracking-[0.25em] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isPending ? "sending…" : "submit enquiry"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

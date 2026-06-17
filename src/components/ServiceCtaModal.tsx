"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Closing call-to-action for a service landing page.
 *
 * Renders the premium horizontal banner (editorial copy left, action button
 * right) used on the homepage ConsultationSection. The raw Tally iframe is no
 * longer baked into the page body — it lives behind a state-driven, backdrop-
 * blurred modal so the form only surfaces when the visitor opts in, inside a
 * spacious, deeply padded window that avoids claustrophobic scrolling.
 */
export default function ServiceCtaModal({
  headline,
  description,
  tallyUrl,
  buttonLabel = "Book Consultation",
}: {
  headline?: string | null;
  description?: string | null;
  tallyUrl?: string | null;
  buttonLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Escape-to-close + body scroll lock, mirroring ConsultationSection.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Defensive: nothing to show if neither copy nor a form was authored.
  if (!headline && !description && !tallyUrl) return null;

  return (
    <section className="bg-surface-container-low mt-24 md:mt-32">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 max-w-7xl mx-auto py-16 md:py-24 px-6">
        {/* Left — editorial copy */}
        <div className="max-w-2xl">
          {headline && (
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
              {headline}
            </h2>
          )}
          {description && (
            <p className="text-base text-neutral-600 max-w-2xl whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {/* Right — minimalist trigger mirroring the global "INQUIRY" header
            button. Only shown when a form URL is present. */}
        {tallyUrl && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="border border-neutral-800 px-8 py-3.5 text-xs uppercase tracking-widest text-neutral-900 hover:bg-neutral-800 hover:text-[#faf8f5] transition-colors"
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>

      {/* Backdrop-blur modal — keeps the Tally form hidden until opt-in. */}
      <AnimatePresence>
        {isOpen && tallyUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={headline || "Inquiry form"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl h-[720px] p-12 bg-[#faf8f5] flex flex-col rounded-sm overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-6 right-6 z-30 w-9 h-9 flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-colors bg-surface/80 backdrop-blur-sm rounded-full"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <iframe
                src={tallyUrl}
                title={headline || "Inquiry form"}
                loading="eager"
                className="w-full h-full border-0 overflow-y-auto bg-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

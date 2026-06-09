"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Condensed consultation action row. The Tally intake form no longer lives in
// the page body — it sits behind a state-driven modal so the section reads as a
// quiet editorial banner (typography left, action button right) and only
// surfaces the form when the visitor opts in.
export default function ConsultationSection() {
  const [isOpen, setIsOpen] = useState(false);

  // Escape-to-close + body scroll lock, mirroring ServiceEnquiryModal/ShopModal.
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

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        {/* Left — bold typography hierarchy aligned to the site grid. */}
        <div className="max-w-2xl">
          <h2 className="font-serif-brand text-3xl md:text-4xl lg:text-5xl tracking-tight font-light text-on-surface mb-4">
            Free 15-Minute Written Work Consultation
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl">
            Submit your emerging compositions, scores, or project details for a
            direct professional review and live strategic breakdown with Salim
            Dada.
          </p>
        </div>

        {/* Right — action trigger mirroring the header "Inquiry" button. */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="font-label text-xs lg:text-sm uppercase tracking-widest px-8 py-3.5 border border-on-surface/20 text-on-surface hover:bg-on-surface hover:text-surface transition-all duration-300"
          >
            Book Consultation
          </button>
        </div>
      </div>

      {/* Smooth pop-up modal — keeps the form fields and Tally badge hidden
          until the visitor intentionally opens it. */}
      <AnimatePresence>
        {isOpen && (
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
              aria-label="Free 15-Minute Written Work Consultation"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-3xl w-full h-auto max-h-[90vh] bg-[#faf8f5] flex flex-col rounded-sm overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-colors bg-surface/80 backdrop-blur-sm rounded-full"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <iframe
                src="https://tally.so/embed/dWz4jo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                title="Free 15-Minute Written Work Consultation"
                loading="eager"
                className="w-full h-[620px] md:h-[650px] border-0 overflow-y-auto bg-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

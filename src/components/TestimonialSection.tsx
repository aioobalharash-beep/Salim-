"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TestimonialForm from "./TestimonialForm";

interface TestimonialItem {
  _id: string;
  name: string;
  profession?: string | null;
  city?: string | null;
  country?: string | null;
  content: string;
}

function formatByline(t: TestimonialItem): string {
  const place = [t.city, t.country].filter(Boolean).join(", ");
  const lead = [t.name, t.profession].filter(Boolean).join(", ");
  return place ? `${lead} — ${place}` : lead;
}

/* Fisher–Yates (Knuth) in-place shuffle on a copy of the input. */
function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function TestimonialSection({
  items,
}: {
  items: TestimonialItem[];
}) {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Mobile single-item carousel state
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Randomised order, populated client-side after mount. Server render and the
  // client's first render both see [] (matching HTML), so the Fisher–Yates
  // shuffle can never trigger a hydration mismatch.
  const [shuffledTestimonials, setShuffledTestimonials] = useState<
    TestimonialItem[]
  >([]);

  useEffect(() => {
    setShuffledTestimonials(shuffle(items));
  }, [items]);

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let min = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const childCenter = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(childCenter - center);
      if (d < min) {
        min = d;
        nearest = i;
      }
    });
    setActive((prev) => (prev !== nearest ? nearest : prev));
  }, []);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  // No testimonials at all → render nothing (stable across server/client).
  if (items.length === 0) return null;

  const perPage = 3;
  const maxPage = Math.max(
    0,
    Math.ceil(shuffledTestimonials.length / perPage) - 1,
  );
  const visiblePage = Math.min(page, maxPage);
  const visible = shuffledTestimonials.slice(
    visiblePage * perPage,
    visiblePage * perPage + perPage,
  );

  const handleCloseModal = () => setModalOpen(false);

  // Hold the slider markup until the shuffle has run on the client.
  const ready = shuffledTestimonials.length > 0;

  return (
    <section className="py-20 md:py-32 bg-surface-container-low">
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-20 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
            Testimonials
          </p>
          <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-light">
            Words of Trust
          </h3>
        </div>

        {/* Reserve the slider's footprint so cards popping in after the
            client-side shuffle don't shift the layout. */}
        <div className="min-h-[300px] md:min-h-[340px]">
          {ready && (
            <>
              {/* ── Desktop: 3-up grid with hidden arrows ── */}
              {/* Animation kept identical to the Latest Work / Events tracks. */}
              <div className="relative hidden md:block group/slider">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={visiblePage}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    {visible.map((t) => (
                      <div
                        key={t._id}
                        className="p-10 border border-outline-variant/15 bg-surface flex flex-col min-h-[260px]"
                      >
                        <p className="font-headline text-sm leading-[1.9] text-on-surface-variant/70 flex-grow">
                          {t.content}
                        </p>
                        <div className="mt-8 pt-6 border-t border-outline-variant/10">
                          <p className="font-body text-[11px] tracking-normal text-on-surface/70">
                            {formatByline(t)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Hidden arrows */}
                {shuffledTestimonials.length > perPage && (
                  <>
                    <button
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={visiblePage === 0}
                      aria-label="Previous testimonials"
                    >
                      <span className="text-on-surface text-sm">←</span>
                    </button>
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
                      onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                      disabled={visiblePage >= maxPage}
                      aria-label="Next testimonials"
                    >
                      <span className="text-on-surface text-sm">→</span>
                    </button>
                  </>
                )}
              </div>

              {/* ── Mobile: one testimonial per slide, side-swipe ── */}
              {/* items-start lets each card size to its own content (h-auto)
                  instead of every slide stretching to the tallest quote. */}
              <div className="md:hidden">
                <div
                  ref={trackRef}
                  onScroll={handleScroll}
                  className="flex items-start overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 -mx-6 px-6 pb-1"
                >
                  {shuffledTestimonials.map((t) => (
                    <div key={t._id} className="snap-center shrink-0 w-full">
                      <div className="py-6 px-4 border border-outline-variant/15 bg-surface">
                        <p className="font-headline text-sm leading-[1.75] text-on-surface-variant/70">
                          {t.content}
                        </p>
                        <div className="mt-4 pt-4 border-t border-outline-variant/10">
                          <p className="font-body text-[11px] tracking-normal text-on-surface/70">
                            {formatByline(t)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {shuffledTestimonials.length > 1 && (
                  <div className="flex justify-center gap-2 mt-5">
                    {shuffledTestimonials.map((t, i) => (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Show testimonial ${i + 1} of ${shuffledTestimonials.length}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === active
                            ? "w-6 bg-on-surface"
                            : "w-1.5 bg-on-surface/25 hover:bg-on-surface/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Write Your Own */}
        <div className="mt-10 md:mt-16 text-center">
          <button
            onClick={() => setModalOpen(true)}
            className="font-label tracking-[0.15em] text-[11px] uppercase px-8 py-3 border border-on-surface/20 text-on-surface hover:bg-on-surface hover:text-surface transition-all duration-300"
          >
            Write Your Own
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-surface w-full max-w-md mx-6 p-10 md:p-12 shadow-card"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-on-surface-variant/40 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              <TestimonialForm onClose={handleCloseModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

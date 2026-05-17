"use client";

import { useState } from "react";
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

export default function TestimonialSection({
  items,
}: {
  items: TestimonialItem[];
}) {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (items.length === 0) return null;

  const perPage = 3;
  const maxPage = Math.max(0, Math.ceil(items.length / perPage) - 1);
  const visiblePage = Math.min(page, maxPage);
  const visible = items.slice(visiblePage * perPage, visiblePage * perPage + perPage);

  const handleCloseModal = () => setModalOpen(false);

  return (
    <section className="py-32 bg-surface-container-low">
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
            Testimonials
          </p>
          <h3 className="font-headline text-4xl font-light">
            Words of Trust
          </h3>
        </div>

        {/* Grid with hidden arrows */}
        <div className="relative group/slider">
          <AnimatePresence mode="wait">
            <motion.div
              key={visiblePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
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
          {items.length > perPage && (
            <>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={visiblePage === 0}
              >
                <span className="text-on-surface text-sm">←</span>
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                disabled={visiblePage >= maxPage}
              >
                <span className="text-on-surface text-sm">→</span>
              </button>
            </>
          )}
        </div>

        {/* Write Your Own */}
        <div className="mt-16 text-center">
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

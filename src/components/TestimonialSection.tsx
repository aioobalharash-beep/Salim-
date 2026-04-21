"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialItem {
  _id: string;
  name: string;
  content: string;
}

export default function TestimonialSection({
  items,
}: {
  items: TestimonialItem[];
}) {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0) return null;

  const perPage = 3;
  const maxPage = Math.max(0, Math.ceil(items.length / perPage) - 1);
  const visiblePage = Math.min(page, maxPage);
  const visible = items.slice(visiblePage * perPage, visiblePage * perPage + perPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName || "Anonymous",
        email: "testimonial@submission",
        source: "testimonial",
      }),
    });
    setSubmitted(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormName("");
    setFormText("");
    setSubmitted(false);
  };

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
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface/60">
                      {t.name}
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

              {!submitted ? (
                <>
                  <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
                    Share Your Experience
                  </p>
                  <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
                    Write a Testimonial
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10">
                    Your words help others discover the value of this work. Thank you for sharing.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col space-y-2">
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                        Your Name (optional)
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Anonymous"
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                        Your Experience
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        placeholder="Share your experience..."
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!formText}
                      className="w-full py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      Submit
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-tertiary text-4xl mb-6 block">
                    check_circle
                  </span>
                  <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
                    Thank You
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
                    Your testimonial has been submitted for review.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="font-label text-[10px] uppercase tracking-[0.2em] text-primary hover:text-on-surface transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

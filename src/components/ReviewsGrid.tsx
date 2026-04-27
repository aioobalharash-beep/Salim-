"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface ReviewItem {
  _id: string;
  content: string;
  translation?: string;
  sourceText: string;
  place?: string;
  year: string;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const [translated, setTranslated] = useState(false);
  const hasTranslation = Boolean(review.translation?.trim());
  const showing = translated && hasTranslation ? "translation" : "original";
  const text = showing === "translation" ? review.translation! : review.content;
  const meta = [review.sourceText, review.place, review.year]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="group relative p-8 bg-surface-container-low border border-primary/20 flex flex-col min-h-[220px]">
      <div className="relative flex-1 pr-4 pb-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={showing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-body text-sm leading-[1.8] text-on-surface-variant/80"
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>

      {hasTranslation && (
        <button
          type="button"
          onClick={() => setTranslated((t) => !t)}
          aria-label={
            showing === "translation" ? "Show original" : "Show translation"
          }
          aria-pressed={showing === "translation"}
          className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-on-surface/60 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:opacity-100 ${
            showing === "translation"
              ? "opacity-100 text-primary"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            translate
          </span>
        </button>
      )}

      <p className="absolute bottom-6 right-6 text-right font-body text-xs text-on-surface/70">
        <span className="italic">{review.sourceText}</span>
        {(review.place || review.year) && (
          <span className="text-on-surface/55 not-italic">
            {review.place ? `, ${review.place}` : ""}
            {review.year ? `, ${review.year}` : ""}
          </span>
        )}
        <span className="sr-only">{meta}</span>
      </p>
    </article>
  );
}

export default function ReviewsGrid({ items }: { items: ReviewItem[] }) {
  const [ordered, setOrdered] = useState<ReviewItem[]>(items);

  useEffect(() => {
    setOrdered(shuffle(items));
  }, [items]);

  if (ordered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {ordered.map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  );
}

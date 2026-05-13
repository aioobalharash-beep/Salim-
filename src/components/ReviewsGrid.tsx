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

// Detect script of the review text so we can apply the correct font:
//  - Arabic block (U+0600–U+06FF, U+0750–U+077F, U+08A0–U+08FF, U+FB50–U+FDFF, U+FE70–U+FEFF) → Arabic Typesetting (with Noto Naskh Arabic fallback)
//  - Latin (default)                                                                          → Playfair Display 400 Italic
//  - Anything else (Cyrillic, etc.)                                                           → system font fallback
type Script = "arabic" | "latin" | "other";

const ARABIC_RE =
  /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const CYRILLIC_RE = /[Ѐ-ӿԀ-ԯ]/;

function detectScript(text: string): Script {
  if (ARABIC_RE.test(text)) return "arabic";
  // Cyrillic — fall back to system serif rather than forcing Playfair Italic
  if (CYRILLIC_RE.test(text)) return "other";
  return "latin";
}

function fontClassForScript(script: Script): string {
  switch (script) {
    case "arabic":
      return "font-arabic-serif font-normal not-italic";
    case "latin":
      return "font-serif-brand font-normal italic";
    case "other":
    default:
      return "font-headline font-normal";
  }
}

function textSizeForScript(script: Script): string {
  if (script === "arabic") return "text-xl md:text-2xl";
  return "text-base md:text-lg";
}

function langForScript(script: Script): string | undefined {
  if (script === "arabic") return "ar";
  return undefined;
}

function dirForScript(script: Script): "rtl" | "ltr" {
  return script === "arabic" ? "rtl" : "ltr";
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const hasTranslation = Boolean(review.translation?.trim());
  const showing = isTranslated && hasTranslation ? "translation" : "original";
  const text = showing === "translation" ? review.translation! : review.content;
  const meta = [review.sourceText, review.place, review.year]
    .filter(Boolean)
    .join(", ");
  const script = detectScript(text);
  const fontClass = fontClassForScript(script);
  const textSize = textSizeForScript(script);
  const lang = langForScript(script);
  const dir = dirForScript(script);

  return (
    <article className="group relative">
      {/* Layout-animated wrapper keeps card height stable while the two texts cross-fade */}
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={showing}
            lang={lang}
            dir={dir}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${fontClass} ${textSize} leading-[1.7] text-on-surface/85 text-center`}
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-8 max-w-3xl mx-auto flex items-baseline justify-between gap-6"
      >
        {/* Single-word toggle, hidden entirely when no translation exists */}
        <div className="min-w-[5rem]">
          {hasTranslation && (
            <button
              type="button"
              onClick={() => setIsTranslated((v) => !v)}
              aria-pressed={isTranslated}
              aria-label={
                isTranslated ? "Show original" : "Show translation"
              }
              className="font-body text-xs lowercase tracking-wide text-on-surface/55 hover:text-on-surface transition-colors duration-300 focus:outline-none focus-visible:text-on-surface"
            >
              {isTranslated ? "original" : "translate"}
            </button>
          )}
        </div>

        <p className="font-body text-xs text-on-surface/70 text-right">
          <span className="font-bold not-italic">{review.sourceText}</span>
          {(review.place || review.year) && (
            <span className="text-on-surface/55 not-italic">
              {review.place ? `, ${review.place}` : ""}
              {review.year ? `, ${review.year}` : ""}
            </span>
          )}
          <span className="sr-only">{meta}</span>
        </p>
      </motion.div>
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
    <div className="flex flex-col items-center gap-32 md:gap-48 py-16">
      {ordered.map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  );
}

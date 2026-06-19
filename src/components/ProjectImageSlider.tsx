"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { urlFor, type SanityImageSource } from "@/sanity/image";

export type SliderImage = SanityImageSource & {
  _key?: string;
  alt?: string | null;
  title?: string | null;
  description?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

/* Cards shown clearly on each side of the focal card, plus one hidden buffer
 * slot used only on large sets for a smooth slide-in. */
const VISIBLE = 3;
const BUFFER = VISIBLE + 1;
/* Horizontal step between card centres, as a % of the track width. */
const GAP = 15;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SLIDE =
  "left 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s cubic-bezier(0.22,1,0.36,1)";

function hasAsset(img?: SliderImage | null): img is SliderImage {
  const asset = (img as { asset?: { _ref?: string; _id?: string } } | null)
    ?.asset;
  return !!(asset && (asset._ref || asset._id));
}

export default function ProjectImageSlider({
  images: rawImages,
}: {
  images: SliderImage[];
}) {
  const images = (rawImages ?? []).filter(hasAsset);
  const count = images.length;
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  // Last committed slot per card, so we can detect a wrap-around jump and let
  // that card teleport (transition disabled) instead of sliding across screen.
  const prevOffsets = useRef<Map<string, number>>(new Map());

  // `active` runs unbounded; the ring wraps via modulo.
  const safe = count > 0 ? ((active % count) + count) % count : 0;

  // Signed shortest-path offset of card `i` from the focal card.
  const offsetOf = (i: number) => {
    let d = i - safe;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  // Persist the committed slots after each paint (read during the next render).
  useEffect(() => {
    if (count === 0) return;
    const m = new Map<string, number>();
    images.forEach((img, i) => m.set(img._key ?? String(i), offsetOf(i)));
    prevOffsets.current = m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe, count]);

  if (count === 0) return null;

  const current = images[safe];
  const go = (dir: number) => setActive((a) => a + dir);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ── Coverflow track ── */}
      <div
        className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] flex items-center justify-center overflow-hidden select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => {
          const offset = offsetOf(i);
          const abs = Math.abs(offset);
          if (abs > BUFFER) return null;

          const key = img._key ?? String(i);
          const prev = prevOffsets.current.get(key);
          // A jump of more than one slot is a wrap-around → teleport (no slide)
          // so the card never travels across the viewport from the far side.
          const teleport = prev !== undefined && Math.abs(offset - prev) > 1;

          const isCenter = offset === 0;
          const inView = abs <= VISIBLE;
          const cardOpacity = isCenter ? 1 : inView ? 1 - abs * 0.1 : 0;
          const veilOpacity = isCenter ? 0 : Math.min(0.78, abs * 0.22);
          // Wings step down sharply from the focal card so a tall portrait
          // never rivals the centre — the first wing is already clearly small.
          const scale = isCenter ? 1 : 0.62 - (abs - 1) * 0.14;

          const dims = img.dimensions;
          const w = dims?.width ?? 1000;
          const h = dims?.height ?? 1250;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(active + offset)}
              aria-label={isCenter ? "Current image" : `Go to image ${i + 1}`}
              tabIndex={isCenter ? 0 : -1}
              style={{
                left: `${50 + offset * GAP}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: cardOpacity,
                zIndex: 30 - abs,
                transition: teleport ? "none" : SLIDE,
              }}
              className="absolute top-1/2 will-change-transform"
            >
              <div className="relative shadow-[0_20px_48px_rgba(26,26,26,0.16)]">
                <Image
                  src={urlFor(img)
                    .width(1100)
                    .quality(85)
                    .auto("format")
                    .url()}
                  alt={img.alt || img.title || ""}
                  width={w}
                  height={h}
                  sizes="(max-width: 768px) 80vw, 600px"
                  className="block w-auto h-auto max-h-[300px] sm:max-h-[420px] md:max-h-[500px] max-w-[80vw] md:max-w-[600px] object-contain"
                  priority={i === 0}
                />
                {/* Muted ivory wash deepens with distance for premium depth. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-surface"
                  style={{
                    opacity: veilOpacity,
                    transition: teleport ? "none" : `opacity 0.5s ${EASE}`,
                  }}
                />
              </div>
            </button>
          );
        })}

        {/* Arrows — muted Ivory/Ebony */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm text-on-surface shadow-card hover:bg-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm text-on-surface shadow-card hover:bg-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* ── Reactive caption — small editorial tone, sits ABOVE the dots ── */}
      {(current.title || current.description) && (
        <div className="min-h-[1.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._key ?? safe}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-xs md:text-sm font-body tracking-wide text-foreground/55 text-center mt-4 mb-2 max-w-xl mx-auto whitespace-pre-line"
            >
              {current.title && (
                <span className="block text-foreground/80">{current.title}</span>
              )}
              {current.description && <span className="block">{current.description}</span>}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── Dots ── */}
      {count > 1 && (
        <div className="flex justify-center flex-wrap gap-2 mt-2">
          {images.map((img, i) => (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => setActive(active + offsetOf(i))}
              aria-label={`Go to image ${i + 1} of ${count}`}
              aria-current={i === safe ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === safe
                  ? "w-6 bg-on-surface"
                  : "w-1.5 bg-on-surface/25 hover:bg-on-surface/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

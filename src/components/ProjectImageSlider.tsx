"use client";

import { useRef, useState } from "react";
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

/* Cards rendered on each side of the active focal card. */
const MAX_WING = 3;

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

  if (count === 0) return null;

  // `active` runs unbounded; `safe` is the wrapped index of the focal card.
  const safe = ((active % count) + count) % count;
  const current = images[safe];

  const go = (dir: number) => setActive((a) => a + dir);

  // Signed shortest-path offset of card `i` from the focal card, so the
  // wings wrap symmetrically around the centre.
  const offsetOf = (i: number) => {
    let d = i - safe;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

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
        className="relative w-full h-[380px] sm:h-[480px] md:h-[560px] flex items-center justify-center overflow-hidden select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => {
          const offset = offsetOf(i);
          if (Math.abs(offset) > MAX_WING) return null;
          const abs = Math.abs(offset);
          const isCenter = offset === 0;
          const scale = isCenter ? 1 : 1 - abs * 0.12;
          const opacity = isCenter ? 1 : Math.max(0, 1 - abs * 0.28);
          return (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => setActive(active + offset)}
              aria-label={
                isCenter ? "Current image" : `Go to image ${i + 1}`
              }
              tabIndex={isCenter ? 0 : -1}
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 64}%) scale(${scale})`,
                opacity,
                zIndex: 20 - abs,
              }}
              className="absolute left-1/2 top-1/2 w-[240px] sm:w-[300px] md:w-[360px] aspect-[3/4] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            >
              <div
                className={`relative w-full h-full overflow-hidden bg-on-surface/[0.04] ${
                  isCenter
                    ? "shadow-[0_24px_60px_rgba(26,26,26,0.18)]"
                    : "shadow-[0_12px_30px_rgba(26,26,26,0.08)]"
                }`}
              >
                <Image
                  src={urlFor(img)
                    .width(900)
                    .quality(85)
                    .auto("format")
                    .url()}
                  alt={img.alt || img.title || ""}
                  fill
                  sizes="(max-width: 768px) 70vw, 360px"
                  className="object-cover"
                />
                {/* Muted ivory veil over the inactive wings for depth. */}
                {!isCenter && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-surface/30"
                  />
                )}
              </div>
            </button>
          );
        })}

        {/* Arrows — muted Ivory/Ebony */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm text-on-surface shadow-card hover:bg-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm text-on-surface shadow-card hover:bg-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* ── Dots ── */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-6">
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

      {/* ── Reactive caption — updates with the focal image ── */}
      {(current.title || current.description) && (
        <div className="max-w-2xl mx-auto mt-6 text-center min-h-[2rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._key ?? safe}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {current.title && (
                <h3 className="font-headline text-xl md:text-2xl text-foreground mb-2">
                  {current.title}
                </h3>
              )}
              {current.description && (
                <p className="font-body text-sm md:text-base leading-relaxed text-foreground/55 whitespace-pre-line">
                  {current.description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

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

/* Cards visible on each side of the focal card, plus one buffer card that sits
 * just out of view (opacity 0) so neighbours slide in/out smoothly rather than
 * popping. Nothing wraps around — edge cards simply fade away. */
const VISIBLE = 3;
const BUFFER = VISIBLE + 1;
/* Horizontal step between cards, as a % of the track width (responsive). */
const GAP = 15;

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

  const safe = Math.min(Math.max(active, 0), count - 1);
  const current = images[safe];

  // Clamp at the ends — no wrap-around.
  const go = (dir: number) =>
    setActive((a) => Math.min(count - 1, Math.max(0, a + dir)));

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
          // Linear offset — no modulo wrap, so far cards fade out in place.
          const offset = i - safe;
          const abs = Math.abs(offset);
          if (abs > BUFFER) return null;

          const isCenter = offset === 0;
          const inView = abs <= VISIBLE;
          // Every card shares one natural-ratio structure; only transform
          // scale, opacity and an ivory wash differ — and all of those animate,
          // so a wing morphs seamlessly into the focal card with no shape snap.
          const cardOpacity = isCenter ? 1 : inView ? Math.max(0.25, 1 - abs * 0.1) : 0;
          const veilOpacity = isCenter ? 0 : Math.min(0.78, abs * 0.24);
          const scale = isCenter ? 1 : 1 - abs * 0.16;

          const dims = img.dimensions;
          const w = dims?.width ?? 1000;
          const h = dims?.height ?? 1250;

          return (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={isCenter ? "Current image" : `Go to image ${i + 1}`}
              tabIndex={isCenter ? 0 : -1}
              style={{
                left: `${50 + offset * GAP}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: cardOpacity,
                zIndex: 30 - abs,
              }}
              className="absolute top-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
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
                  className="absolute inset-0 bg-surface transition-opacity duration-500"
                  style={{ opacity: veilOpacity }}
                />
              </div>
            </button>
          );
        })}

        {/* Arrows — muted Ivory/Ebony, disabled at the ends */}
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={safe === 0}
          aria-label="Previous image"
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm text-on-surface shadow-card hover:bg-surface transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={safe === count - 1}
          aria-label="Next image"
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm text-on-surface shadow-card hover:bg-surface transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* ── Dots ── */}
      {count > 1 && (
        <div className="flex justify-center flex-wrap gap-2 mt-6">
          {images.map((img, i) => (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => setActive(i)}
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

"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor, type SanityImageSource } from "@/sanity/image";

export type SliderImage = SanityImageSource & {
  _key?: string;
  alt?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

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
  const [active, setActive] = useState(0);
  const count = images.length;
  const safe = Math.min(active, Math.max(0, count - 1));
  const current = images[safe];

  const go = (dir: number) => setActive((a) => (a + dir + count) % count);

  if (count === 0 || !current) return null;

  return (
    <div className="w-full">
      {/* ── Main viewport — large, centered, uncropped ── */}
      <div className="relative w-full bg-transparent">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            key={current?._key ?? safe}
            src={urlFor(current)
              .width(1600)
              .quality(90)
              .auto("format")
              .url()}
            alt={current?.alt || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {/* Minimalist overlay arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm text-on-surface hover:bg-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm text-on-surface hover:bg-surface transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      </div>

      {/* ── Thumbnail track — horizontally scrollable, touch-friendly ── */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 mt-3 -mx-1 px-1 snap-x">
        {images.map((img, i) => (
          <button
            key={img?._key ?? i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${count}`}
            aria-current={i === safe ? "true" : undefined}
            className={`relative shrink-0 snap-start w-16 h-16 md:w-20 md:h-20 overflow-hidden transition-opacity duration-200 ${
              i === safe
                ? "ring-2 ring-foreground opacity-100"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <Image
              src={urlFor(img)
                .width(180)
                .height(180)
                .quality(75)
                .auto("format")
                .url()}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

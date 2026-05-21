"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export type ShopSlide = {
  url: string;
  alt: string;
  aspectRatio?: number;
};

interface ShopCarouselProps {
  slides: ShopSlide[];
  title: string;
  fit?: "cover" | "contain";
  sizes?: string;
}

export default function ShopCarousel({
  slides,
  title,
  fit = "contain",
  sizes = "(max-width: 768px) 100vw, 33vw",
}: ShopCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  }, [active]);

  const goTo = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  }, []);

  if (slides.length === 0) {
    return <div className="absolute inset-0 bg-transparent" />;
  }

  const objectFit = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative shrink-0 basis-full w-full h-full snap-center bg-transparent"
          >
            <Image
              src={slide.url}
              alt={slide.alt || `${title} — image ${i + 1}`}
              fill
              sizes={sizes}
              className={`${objectFit} h-full w-full bg-transparent`}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1} of ${slides.length}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 bg-on-surface"
                  : "w-1.5 bg-on-surface/30 hover:bg-on-surface/60"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

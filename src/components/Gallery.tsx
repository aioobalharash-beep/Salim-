"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { urlFor, type SanityImageSource } from "@/sanity/image";

export type GalleryRatio = "landscape" | "balanced" | "portrait";

export type GalleryItem = {
  _id: string;
  image: SanityImageSource;
  description?: string;
  ratio?: GalleryRatio;
};

type RowType = "A" | "B" | "C";

type Row = {
  key: string;
  type: RowType;
  items: GalleryItem[];
};

const ROW_FOR: Record<
  RowType,
  { pool: GalleryRatio; size: number; aspect: string; cols: string; sizes: string }
> = {
  A: {
    pool: "landscape",
    size: 1,
    aspect: "aspect-[16/9]",
    cols: "md:grid-cols-1",
    sizes: "100vw",
  },
  B: {
    pool: "balanced",
    size: 2,
    aspect: "aspect-[4/3]",
    cols: "md:grid-cols-2",
    sizes: "(max-width: 768px) 100vw, 50vw",
  },
  C: {
    pool: "portrait",
    size: 3,
    aspect: "aspect-[3/4]",
    cols: "md:grid-cols-3",
    sizes: "(max-width: 768px) 100vw, 33vw",
  },
};

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildRows(items: GalleryItem[]): Row[] {
  const pools: Record<GalleryRatio, GalleryItem[]> = {
    landscape: shuffle(items.filter((i) => i.ratio === "landscape")),
    balanced: shuffle(items.filter((i) => i.ratio === "balanced")),
    portrait: shuffle(items.filter((i) => i.ratio === "portrait")),
  };

  const rows: Row[] = [];
  let rowIndex = 0;

  while (pools.landscape.length || pools.balanced.length || pools.portrait.length) {
    const available: RowType[] = [];
    if (pools.landscape.length >= 1) available.push("A");
    if (pools.balanced.length >= 2) available.push("B");
    if (pools.portrait.length >= 3) available.push("C");

    let type: RowType;
    if (available.length) {
      type = available[Math.floor(Math.random() * available.length)];
    } else if (pools.balanced.length) {
      type = "B";
    } else if (pools.portrait.length) {
      type = "C";
    } else {
      break;
    }

    const { pool, size } = ROW_FOR[type];
    const take = Math.min(size, pools[pool].length);
    if (take === 0) break;

    rows.push({
      key: `row-${rowIndex}-${type}`,
      type,
      items: pools[pool].splice(0, take),
    });
    rowIndex += 1;
  }

  return rows;
}

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setRows(buildRows(items));
  }, [items]);

  const flat = rows ? rows.flatMap((row) => row.items) : [];
  const active = activeIndex !== null ? flat[activeIndex] ?? null : null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  if (!rows) {
    return <div className="min-h-[60vh]" aria-hidden />;
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center text-on-surface-variant font-body text-sm">
        No images in the gallery yet.
      </div>
    );
  }

  let runningIndex = 0;

  return (
    <>
      <motion.div
        className="w-full flex flex-col gap-0"
        animate={{ opacity: active ? 0.35 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {rows.map((row) => {
          const rowStart = runningIndex;
          runningIndex += row.items.length;
          const { aspect, cols, sizes } = ROW_FOR[row.type];
          return (
            <div key={row.key} className={`grid grid-cols-1 ${cols} gap-0 w-full`}>
              {row.items.map((item, i) => {
                const index = rowStart + i;
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative overflow-hidden ${aspect} block w-full cursor-zoom-in focus:outline-none`}
                    aria-label={item.description || "Open image"}
                  >
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={urlFor(item.image).width(1800).quality(85).url()}
                        alt={item.description || "Gallery image"}
                        fill
                        sizes={sizes}
                        className="object-cover"
                      />
                    </motion.div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-6 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.figure
              className="relative flex flex-col items-center gap-5 max-w-[92vw] max-h-[92vh]"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(active.image).width(2200).quality(90).url()}
                alt={active.description || "Gallery image"}
                width={2200}
                height={1500}
                sizes="92vw"
                className="max-h-[80vh] w-auto h-auto object-contain rounded-sm"
                priority
              />
              {active.description && (
                <figcaption className="font-body text-sm md:text-base text-surface/90 text-center max-w-2xl leading-relaxed">
                  {active.description}
                </figcaption>
              )}
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 rounded-full bg-surface text-on-surface flex items-center justify-center shadow-card"
                aria-label="Close"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

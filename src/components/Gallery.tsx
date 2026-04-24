"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { urlFor, type SanityImageSource } from "@/sanity/image";

export type GalleryItem = {
  _id: string;
  image: SanityImageSource;
  description?: string;
};

type RowType = "A" | "B" | "C";

type Row = {
  key: string;
  type: RowType;
  items: GalleryItem[];
};

const ROW_SIZE: Record<RowType, number> = { A: 1, B: 2, C: 3 };
const ROW_ASPECT: Record<RowType, string> = {
  A: "aspect-[16/9]",
  B: "aspect-[4/3]",
  C: "aspect-[3/4]",
};
const ROW_SIZES: Record<RowType, string> = {
  A: "100vw",
  B: "50vw",
  C: "33vw",
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
  const pool = shuffle(items);
  const rows: Row[] = [];
  let cursor = 0;
  let rowIndex = 0;

  while (cursor < pool.length) {
    const remaining = pool.length - cursor;
    const candidates: RowType[] =
      remaining >= 3 ? ["A", "B", "C"] : remaining === 2 ? ["A", "B"] : ["A"];
    const type = candidates[Math.floor(Math.random() * candidates.length)];
    const size = ROW_SIZE[type];
    rows.push({
      key: `row-${rowIndex}-${type}`,
      type,
      items: pool.slice(cursor, cursor + size),
    });
    cursor += size;
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
    if (active === null) return;
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
          return (
            <div
              key={row.key}
              className={`grid gap-0 w-full`}
              style={{ gridTemplateColumns: `repeat(${row.items.length}, minmax(0, 1fr))` }}
            >
              {row.items.map((item, i) => {
                const index = rowStart + i;
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative overflow-hidden ${ROW_ASPECT[row.type]} block w-full cursor-zoom-in focus:outline-none`}
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
                        sizes={ROW_SIZES[row.type]}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 md:p-12"
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
              <div className="relative">
                <Image
                  src={urlFor(active.image).width(2200).quality(90).url()}
                  alt={active.description || "Gallery image"}
                  width={2200}
                  height={1500}
                  sizes="92vw"
                  className="max-h-[80vh] w-auto h-auto object-contain rounded-sm"
                  priority
                />
              </div>
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

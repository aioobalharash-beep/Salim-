"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/sanity/image";

type Orientation = "vertical" | "horizontal";

interface PortfolioItem {
  _id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  type: "work" | "event";
  orientation?: Orientation;
  pageGroup?: number;
  image?: { asset: { _ref: string } };
  link?: string;
}

/* ── Seed data: demonstrates the two valid page layouts. ─────────────── */
const seedItems: PortfolioItem[] = [
  // Work — page 1: three verticals
  {
    _id: "seed-w1a",
    title: "Suite Algérienne — Solo Guitar",
    eyebrow: "Publication",
    description:
      "Newly published score for solo classical guitar, exploring Algerian modal traditions.",
    type: "work",
    orientation: "vertical",
    pageGroup: 1,
    link: "/catalogue",
  },
  {
    _id: "seed-w1b",
    title: "Conversations — 12 Duets",
    eyebrow: "Publication",
    description:
      "Twelve duets for two violinists, written as a contemporary dialogue across registers.",
    type: "work",
    orientation: "vertical",
    pageGroup: 1,
    link: "/catalogue",
  },
  {
    _id: "seed-w1c",
    title: "Mediterranean Cycle",
    eyebrow: "Symphony",
    description:
      "A symphonic exploration of Mediterranean modal traditions, premiered across three continents.",
    type: "work",
    orientation: "vertical",
    pageGroup: 1,
    link: "/media",
  },
  // Work — page 2: one vertical + one horizontal
  {
    _id: "seed-w2a",
    title: "Echoes of Algiers",
    eyebrow: "Recording",
    description:
      "An archival recording project capturing the unwritten melodies of traditional Algerian music.",
    type: "work",
    orientation: "vertical",
    pageGroup: 2,
    link: "/media/discography",
  },
  {
    _id: "seed-w2b",
    title: "Sinfonietta per archi — Live",
    eyebrow: "Premiere",
    description:
      "Live footage of the first Algerian symphony for strings, recorded in Antwerp ahead of its world premiere.",
    type: "work",
    orientation: "horizontal",
    pageGroup: 2,
    link: "/media/video",
  },

  // Events — page 1: 1V + 1H
  {
    _id: "seed-e1a",
    title: "UNESCO Heritage Gala 2024",
    eyebrow: "Ceremony",
    description:
      "Ceremonial performance celebrating the safeguarding of intangible cultural heritage.",
    type: "event",
    orientation: "vertical",
    pageGroup: 1,
    link: "/about",
  },
  {
    _id: "seed-e1b",
    title: "Paris Conservatoire Masterclass",
    eyebrow: "Masterclass",
    description:
      "An intensive masterclass on orchestration and cross-cultural composition.",
    type: "event",
    orientation: "horizontal",
    pageGroup: 1,
    link: "/training",
  },
];

const seedImages: Record<Orientation, string[]> = {
  vertical: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCm8N-B8paqMsf-Qq--j02S8rM6pwRW5iYqhHbHQ3hj2godwwe3TKmYIsI7ej8NDw2AjUkqulg6_K2Q1hT1gSowt7saduB_gri2VVFY2gxrzqFoNt8s-dBXbPGE_N4z-KP3YAj6Fry0EDBpuzfDswB5IOIUFV9UORspEBbQ2RygTCs6h09hJn2y6IMwdj7PtZHsrjB-Qzkf5sH21qoeJbvm-WyKQ0inrbQeiEBuZAaVPlzzgWlS3oK86Y0f1SsEt64H_U4O2HbaH7Q",
  ],
  horizontal: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQncCtMO1LDFajAnhmh05zwIo_IQRwymL9y2EG3ceqtszirfBoTL70nYvS4bLIgIv_iONQu42Df7ta_GKfzf6T7l_lBBDOXEBsFXs5GMB6oSPVe7O433s8_gpm-LXrqwPK4FZW6yEK0rDPZ_EvlOZfSof6F5ozP2PJz20Qqv0tDNn_5VDCOJBBu3q5h6snC2z7Qcirlb61C7k1undiDIlwmVNMBDTN8ZkzBbGob-_MapKkypGt2t025qAPtNDusV1A4rZV9AJR3Y",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2HzKVHVrZU6DMo9jGpg-hq9CrPTt2yR8306t0OXm2yM4T0dfOEedW2PPtbVEbZQLWxTWzziuGZ3jEzJsdT2NKBpfojGCzWJAyQ0s1b0_qdaB8wZxUUuxnVKNKP0MBKG5llqth2Ix3LWgkhT678AcgeGwhV_jikD4zMUmk3N1bQJZ_3How9am7KuP0OOKyOF4zNMNWUILr0xgwyBnra0d0arAmkFr0dRNos-rDU28KERJlBmB7rW-T4yl5Z38Gznb-0U53hioNps",
  ],
};

/* ── Layout decision: classify a group's composition. ────────────────── */
type Layout = "threeVertical" | "verticalPlusHorizontal" | "fallback";

function classifyGroup(items: PortfolioItem[]): Layout {
  if (
    items.length === 3 &&
    items.every((i) => (i.orientation ?? "vertical") === "vertical")
  ) {
    return "threeVertical";
  }
  if (items.length === 2) {
    const orientations = items.map((i) => i.orientation ?? "vertical").sort();
    if (orientations[0] === "horizontal" && orientations[1] === "vertical") {
      return "verticalPlusHorizontal";
    }
  }
  return "fallback";
}

/* Group items by pageGroup. If pageGroup is missing, fall back to
 * auto-chunking based on orientation: greedily emit 3-vertical pages
 * when possible, otherwise pair a vertical with a horizontal. */
function buildPages(items: PortfolioItem[]): PortfolioItem[][] {
  const haveGroups = items.some((i) => typeof i.pageGroup === "number");

  if (haveGroups) {
    const buckets = new Map<number, PortfolioItem[]>();
    for (const item of items) {
      const key = item.pageGroup ?? 9999;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(item);
    }
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, list]) => list);
  }

  // Auto-chunk fallback for legacy entries.
  const pages: PortfolioItem[][] = [];
  const queue = [...items];
  while (queue.length > 0) {
    const next3 = queue.slice(0, 3);
    if (
      next3.length === 3 &&
      next3.every((i) => (i.orientation ?? "vertical") === "vertical")
    ) {
      pages.push(queue.splice(0, 3));
      continue;
    }
    const v = queue.findIndex(
      (i) => (i.orientation ?? "vertical") === "vertical",
    );
    const h = queue.findIndex((i) => i.orientation === "horizontal");
    if (v !== -1 && h !== -1) {
      const a = queue[v];
      const b = queue[h];
      queue.splice(Math.max(v, h), 1);
      queue.splice(Math.min(v, h), 1);
      pages.push([a, b]);
      continue;
    }
    pages.push(queue.splice(0, Math.min(2, queue.length)));
  }
  return pages;
}

export default function PortfolioSlider({
  items,
}: {
  items: PortfolioItem[];
}) {
  const useSeed = items.length === 0;
  const all = useSeed ? seedItems : items;

  const [activeTab, setActiveTab] = useState<"work" | "event">("work");
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(
    () => buildPages(all.filter((i) => i.type === activeTab)),
    [all, activeTab],
  );

  const maxPage = Math.max(0, pages.length - 1);
  const visiblePage = Math.min(page, maxPage);
  const visible = pages[visiblePage] ?? [];
  const layout = classifyGroup(visible);

  const handleTabChange = (tab: "work" | "event") => {
    setActiveTab(tab);
    setPage(0);
  };

  function getImageSrc(item: PortfolioItem, index: number) {
    const orientation: Orientation = item.orientation ?? "vertical";
    if (useSeed || !item.image) {
      const pool = seedImages[orientation];
      return pool[index % pool.length];
    }
    if (orientation === "vertical") {
      return urlFor(item.image).width(600).height(800).url();
    }
    return urlFor(item.image).width(900).height(600).url();
  }

  // Always use a 3-column grid so card width stays consistent across pages.
  // - All-vertical pages: each card spans 1 column (and any missing 3rd slot
  //   is just left empty, which is fine).
  // - 1V + 1H pages: the vertical spans 1 column at aspect 3:4, and the
  //   horizontal spans 2 columns at aspect 3:2 — the two card heights then
  //   match exactly (W·4/3 = 2W·2/3), keeping the row visually balanced.
  const gridClass = "grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-start";

  function aspectClass(item: PortfolioItem) {
    return (item.orientation ?? "vertical") === "horizontal"
      ? "aspect-[3/2]"
      : "aspect-[3/4]";
  }

  function colSpanClass(item: PortfolioItem) {
    if (layout === "verticalPlusHorizontal") {
      return (item.orientation ?? "vertical") === "horizontal"
        ? "md:col-span-2"
        : "md:col-span-1";
    }
    return "md:col-span-1";
  }

  function sizesAttr(item: PortfolioItem) {
    if (
      layout === "verticalPlusHorizontal" &&
      (item.orientation ?? "vertical") === "horizontal"
    ) {
      return "(max-width: 768px) 100vw, 66vw";
    }
    return "(max-width: 768px) 100vw, 33vw";
  }

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
      {/* Header with tabs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
        <div>
          <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-light mb-4">
            Work &amp; Events
          </h3>
          <div className="w-16 h-[1px] bg-primary/30" />
        </div>
        <div className="flex gap-8 mt-6 md:mt-0">
          {(["work", "event"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`font-label text-[11px] uppercase tracking-[0.2em] pb-2 border-b transition-all duration-300 ${
                activeTab === tab
                  ? "text-on-surface border-on-surface"
                  : "text-on-surface/30 border-transparent hover:text-on-surface/60"
              }`}
            >
              {tab === "work" ? "Work" : "Events"}
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div ref={containerRef} className="relative group/slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${visiblePage}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={gridClass}
          >
            {visible.map((item, i) => {
              const Wrapper = item.link ? "a" : "div";
              const wrapperProps = item.link
                ? {
                    href: item.link,
                    target: item.link.startsWith("http")
                      ? ("_blank" as const)
                      : undefined,
                    rel: item.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined,
                  }
                : {};
              return (
                <Wrapper
                  key={item._id}
                  {...wrapperProps}
                  className={`block group cursor-pointer text-center ${colSpanClass(item)}`}
                >
                  <div
                    className={`${aspectClass(item)} w-full overflow-hidden relative bg-surface-container-low border border-outline-variant/20 shadow-[0_2px_18px_rgba(0,0,0,0.04)]`}
                  >
                    <Image
                      src={getImageSrc(item, i)}
                      alt={item.title}
                      fill
                      sizes={sizesAttr(item)}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-6">
                    {item.eyebrow && (
                      <span className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/60 mb-3 block">
                        {item.eyebrow}
                      </span>
                    )}
                    <h4 className="font-serif-brand text-xl md:text-2xl text-on-surface leading-snug group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="font-body text-sm md:text-[15px] leading-relaxed text-on-surface-variant/70 mt-4 max-w-prose mx-auto">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Hidden arrows — appear on hover when there's more than one page */}
        {pages.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={visiblePage === 0}
              aria-label="Previous page"
            >
              <span className="text-on-surface text-sm">←</span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={visiblePage >= maxPage}
              aria-label="Next page"
            >
              <span className="text-on-surface text-sm">→</span>
            </motion.button>
          </>
        )}

        {/* Page dots */}
        {pages.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-[3px] transition-all duration-300 ${
                  i === visiblePage
                    ? "w-8 bg-on-surface"
                    : "w-4 bg-on-surface/20 hover:bg-on-surface/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

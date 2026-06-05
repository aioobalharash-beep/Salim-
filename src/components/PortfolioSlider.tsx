"use client";

import { useState, useRef, useMemo, useCallback } from "react";
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

/* Hard ceiling of items shown per desktop view. The grid is 3 columns wide,
 * so a page must never exceed 3 items or it wraps onto a messy second row. */
const MAX_PER_PAGE = 3;

/* Split any oversized page into chunks of at most MAX_PER_PAGE, preserving
 * order. This is the safety net that keeps items 4, 5, … on the next page
 * (reachable via the arrows / dots) instead of leaking below the row. */
function capPages(pages: PortfolioItem[][]): PortfolioItem[][] {
  const out: PortfolioItem[][] = [];
  for (const page of pages) {
    if (page.length <= MAX_PER_PAGE) {
      out.push(page);
      continue;
    }
    for (let i = 0; i < page.length; i += MAX_PER_PAGE) {
      out.push(page.slice(i, i + MAX_PER_PAGE));
    }
  }
  return out;
}

/* Group items by pageGroup. If pageGroup is missing, fall back to
 * auto-chunking based on orientation: greedily emit 3-vertical pages
 * when possible, otherwise pair a vertical with a horizontal. Either way
 * the result is capped so no page ever exceeds 3 items. */
function buildPages(items: PortfolioItem[]): PortfolioItem[][] {
  const haveGroups = items.some((i) => typeof i.pageGroup === "number");

  if (haveGroups) {
    const buckets = new Map<number, PortfolioItem[]>();
    for (const item of items) {
      const key = item.pageGroup ?? 9999;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(item);
    }
    const grouped = Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, list]) => list);
    return capPages(grouped);
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
  return capPages(pages);
}

function getImageSrc(item: PortfolioItem, index: number, useSeed: boolean) {
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

/* ── Shared visual card (used by both desktop grid and mobile slider) ── */
function PortfolioCard({
  item,
  src,
  aspect,
  sizes,
  className = "",
}: {
  item: PortfolioItem;
  src: string;
  aspect: string;
  sizes: string;
  className?: string;
}) {
  const Wrapper = item.link ? "a" : "div";
  const wrapperProps = item.link
    ? {
        href: item.link,
        target: item.link.startsWith("http")
          ? ("_blank" as const)
          : undefined,
        rel: item.link.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block group cursor-pointer text-center ${className}`}
    >
      <div
        className={`${aspect} w-full overflow-hidden relative bg-surface-container-low border border-outline-variant/20 shadow-[0_2px_18px_rgba(0,0,0,0.04)]`}
      >
        <Image
          src={src}
          alt={item.title}
          fill
          sizes={sizes}
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
}

/* ── Minimalist slider dots ──────────────────────────────────────────── */
function SliderDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to item ${i + 1} of ${count}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active
              ? "w-6 bg-on-surface"
              : "w-1.5 bg-on-surface/25 hover:bg-on-surface/50"
          }`}
        />
      ))}
    </div>
  );
}

/* ── One independent block (e.g. "Latest Work" or "Events") ──────────── */
function PortfolioBlock({
  title,
  items,
  useSeed,
}: {
  title: string;
  items: PortfolioItem[];
  useSeed: boolean;
}) {
  /* Desktop paged-grid state */
  const [page, setPage] = useState(0);
  const pages = useMemo(() => buildPages(items), [items]);
  const maxPage = Math.max(0, pages.length - 1);
  const visiblePage = Math.min(page, maxPage);
  // Defensive cap: the desktop grid renders at most 3 columns, so never map
  // more than 3 items into a single view (pages are already capped upstream).
  const visible = (pages[visiblePage] ?? []).slice(0, MAX_PER_PAGE);
  const layout = classifyGroup(visible);

  /* Mobile horizontal-slider state */
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let min = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const childCenter = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(childCenter - center);
      if (d < min) {
        min = d;
        nearest = i;
      }
    });
    setActive((prev) => (prev !== nearest ? nearest : prev));
  }, []);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  if (items.length === 0) return null;

  /* Desktop grid: keep card width consistent across pages. */
  const gridClass =
    "grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-start";

  const aspectClass = (item: PortfolioItem) =>
    (item.orientation ?? "vertical") === "horizontal"
      ? "aspect-[3/2]"
      : "aspect-[3/4]";

  const colSpanClass = (item: PortfolioItem) => {
    if (layout === "verticalPlusHorizontal") {
      return (item.orientation ?? "vertical") === "horizontal"
        ? "md:col-span-2"
        : "md:col-span-1";
    }
    return "md:col-span-1";
  };

  const sizesAttr = (item: PortfolioItem) => {
    if (
      layout === "verticalPlusHorizontal" &&
      (item.orientation ?? "vertical") === "horizontal"
    ) {
      return "(max-width: 768px) 100vw, 66vw";
    }
    return "(max-width: 768px) 100vw, 33vw";
  };

  return (
    <div className="mb-24 last:mb-0 md:mb-32">
      {/* Section heading */}
      <div className="mb-10 md:mb-14">
        <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-light mb-4">
          {title}
        </h3>
        <div className="w-16 h-[1px] bg-primary/30" />
      </div>

      {/* ── Desktop: paged grid slider (stacked, distinct) ── */}
      <div className="relative hidden md:block group/slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={visiblePage}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={gridClass}
          >
            {visible.map((item, i) => (
              <PortfolioCard
                key={item._id}
                item={item}
                src={getImageSrc(item, i, useSeed)}
                aspect={aspectClass(item)}
                sizes={sizesAttr(item)}
                className={colSpanClass(item)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Hidden arrows — appear on hover when there's more than one page */}
        {pages.length > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={visiblePage === 0}
              aria-label="Previous page"
            >
              <span className="text-on-surface text-sm">←</span>
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={visiblePage >= maxPage}
              aria-label="Next page"
            >
              <span className="text-on-surface text-sm">→</span>
            </button>
          </>
        )}

        {/* Desktop page dots */}
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

      {/* ── Mobile: touch-responsive horizontal slider ── */}
      <div className="md:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 -mx-6 px-6 pb-1"
        >
          {items.map((item, i) => (
            <div
              key={item._id}
              className="snap-center shrink-0 w-[80%] first:ml-0"
            >
              <PortfolioCard
                item={item}
                src={getImageSrc(item, i, useSeed)}
                aspect={aspectClass(item)}
                sizes="80vw"
              />
            </div>
          ))}
        </div>

        <SliderDots count={items.length} active={active} onSelect={goTo} />
      </div>
    </div>
  );
}

export default function PortfolioSlider({ items }: { items: PortfolioItem[] }) {
  const useSeed = items.length === 0;
  const all = useSeed ? seedItems : items;

  const works = useMemo(() => all.filter((i) => i.type === "work"), [all]);
  const events = useMemo(() => all.filter((i) => i.type === "event"), [all]);

  return (
    <section className="py-20 md:py-28 px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
      {/* Two completely independent, vertically stacked sections. */}
      <PortfolioBlock title="Latest Work" items={works} useSeed={useSeed} />
      <PortfolioBlock title="Events" items={events} useSeed={useSeed} />
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import ShopCard from "./ShopCard";
import type { ShopSlide } from "./ShopCarousel";
import type { ShopAudioTrack, ShopInfoRow } from "./ShopModal";

const ITEMS_PER_PAGE = 8;

export type ShopCategory = "albums" | "scores" | "books" | "others";
export type CategoryFilter = "all" | ShopCategory;
export type SortOption =
  | "latest-year"
  | "oldest-year"
  | "price-asc"
  | "price-desc";

export interface ShopGridItem {
  _id: string;
  title: string;
  priceText: string;
  description?: string;
  purchaseUrl: string;
  slides: ShopSlide[];
  additionalInfo?: ShopInfoRow[];
  audioTracks?: ShopAudioTrack[];
  category?: ShopCategory;
  year?: number;
  month?: string;
}

// Combines year + month into a single comparable integer (YYYYMM) by
// concatenating the strings — e.g. year 2026, month "05" -> 202605.
// A missing or malformed month defaults to "01" so January stands in for
// items where the editor only filled in the year. Items without a year
// fall back to the supplied sentinel so they can be pushed to the end of
// either sort direction.
function publicationKey(
  year: number | undefined,
  month: string | undefined,
  missing: number,
): number {
  if (year == null) return missing;
  const monthStr =
    month && /^\d{1,2}$/.test(month)
      ? String(month).padStart(2, "0")
      : "01";
  const value = parseInt(`${year}${monthStr}`, 10);
  return Number.isFinite(value) ? value : missing;
}

interface ShopGridProps {
  items: ShopGridItem[];
}

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "albums", label: "Albums" },
  { value: "scores", label: "Scores" },
  { value: "books", label: "Books" },
  { value: "others", label: "Others" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest-year", label: "Latest" },
  { value: "oldest-year", label: "Oldest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopGrid({ items }: ShopGridProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("latest-year");
  const [currentPage, setCurrentPage] = useState(1);

  const visibleItems = useMemo(() => {
    const filtered = items.filter(
      (item) =>
        selectedCategory === "all" || item.category === selectedCategory,
    );
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "latest-year": {
          // Newest first. Undated items get 0 so they fall to the bottom.
          const dateA = publicationKey(a.year, a.month, 0);
          const dateB = publicationKey(b.year, b.month, 0);
          return dateB - dateA;
        }
        case "oldest-year": {
          // Earliest first. Undated items get Infinity so they stay at
          // the bottom in an ascending sort too.
          const dateA = publicationKey(
            a.year,
            a.month,
            Number.POSITIVE_INFINITY,
          );
          const dateB = publicationKey(
            b.year,
            b.month,
            Number.POSITIVE_INFINITY,
          );
          return dateA - dateB;
        }
        case "price-asc":
        case "price-desc": {
          const pa = parseFloat(a.priceText) || 0;
          const pb = parseFloat(b.priceText) || 0;
          return sortOption === "price-asc" ? pa - pb : pb - pa;
        }
      }
    });
  }, [items, selectedCategory, sortOption]);

  // Reset to the first page whenever the active filter or sort changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortOption]);

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safePage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = visibleItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <CleanSelect
          ariaLabel="Filter by category"
          value={selectedCategory}
          onChange={(v) => setSelectedCategory(v as CategoryFilter)}
          options={CATEGORY_OPTIONS}
        />
        <CleanSelect
          ariaLabel="Sort products"
          value={sortOption}
          onChange={(v) => setSortOption(v as SortOption)}
          options={SORT_OPTIONS}
        />
      </div>

      {visibleItems.length === 0 ? (
        <p className="font-body text-sm text-on-surface-variant max-w-xl">
          No items match this filter.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {currentItems.map((item) => (
              <ShopCard
                key={item._id}
                productId={item._id}
                title={item.title}
                priceText={item.priceText}
                description={item.description}
                purchaseUrl={item.purchaseUrl}
                slides={item.slides}
                additionalInfo={item.additionalInfo}
                audioTracks={item.audioTracks}
              />
            ))}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-16"
          />
        </>
      )}
    </>
  );
}

interface CleanSelectProps<T extends string> {
  ariaLabel: string;
  value: T;
  onChange: (value: string) => void;
  options: { value: T; label: string }[];
}

function CleanSelect<T extends string>({
  ariaLabel,
  value,
  onChange,
  options,
}: CleanSelectProps<T>) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer bg-transparent border border-on-surface/20 hover:border-on-surface/60 focus:border-on-surface focus:outline-none transition-colors duration-300 font-label text-[11px] uppercase tracking-[0.15em] text-on-surface py-2.5 pl-4 pr-10"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface/60">
        expand_more
      </span>
    </div>
  );
}

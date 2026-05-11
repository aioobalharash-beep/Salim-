"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

/* ── Option lists kept in lock-step with the Sanity schema ───────── */
const INSTRUMENTATIONS = [
  "Symphony Orchestra",
  "Wind & Military Orchestra",
  "Chamber Orchestra",
  "Strings",
  "Winds",
  "Voice",
  "Takht Arabi",
  "Hybrid Ensemble",
  "Guitar",
  "Piano",
  "Electronics",
  "Other",
] as const;

const GENRES = [
  "Symphonic Works",
  "Chamber Music",
  "Vocal Forms",
  "Soundtrack",
  "Solo Music",
  "Traditional & Mixed Ensemble",
  "Contemporary Song",
  "Arrangement & Orchestration",
  "Didactic Music",
  "Other",
] as const;

const DURATION_MIN = 0;
const DURATION_MAX = 180; // 180+

type SortKey =
  | "yearDesc"
  | "yearAsc"
  | "titleAsc"
  | "durationDesc"
  | "durationAsc"
  | "movementsDesc"
  | "movementsAsc";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "yearDesc", label: "Year — Newest" },
  { value: "yearAsc", label: "Year — Oldest" },
  { value: "titleAsc", label: "Alphabetical" },
  { value: "durationDesc", label: "Duration — Longest" },
  { value: "durationAsc", label: "Duration — Shortest" },
  { value: "movementsDesc", label: "Movements — Most" },
  { value: "movementsAsc", label: "Movements — Fewest" },
];

export interface CatalogueWork {
  _id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  year: string | null;
  instrumentation: string | null;
  genre: string | null;
  durationMinutes: number | null;
  durationDisplay: string | null;
  movements: number | null;
  published: boolean | null;
  premiereDate: string | null;
  premierePlace: string | null;
  performers: string | null;
  watchLink: string | null;
  audioUrl: string | null;
  slug?: string | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string[] | null;
    ogImage?: unknown;
  } | null;
}

function formatPremiereDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Audio play button (single-instance per page) ─────────────────── */
function PlayButton({
  src,
  audioRef,
  setActiveSrc,
  activeSrc,
}: {
  src: string;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setActiveSrc: (s: string | null) => void;
  activeSrc: string | null;
}) {
  const isActive = activeSrc === src;

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (isActive) {
      el.pause();
      setActiveSrc(null);
      return;
    }
    el.src = src;
    el.play().then(() => setActiveSrc(src)).catch(() => setActiveSrc(null));
  }

  return (
    <button
      onClick={toggle}
      aria-label={isActive ? "Pause audio" : "Play audio"}
      className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.22em] text-foreground/60 hover:text-foreground transition-colors"
    >
      <span className="w-7 h-7 flex items-center justify-center rounded-full border border-foreground/15 group-hover:border-foreground/40 transition-colors">
        <span className="material-symbols-outlined text-[14px]">
          {isActive ? "pause" : "play_arrow"}
        </span>
      </span>
      <span>{isActive ? "Pause" : "Play"}</span>
    </button>
  );
}

/* ── Double-ended duration slider ────────────────────────────────── */
function DurationRange({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label text-[10px] uppercase tracking-[0.22em] text-foreground/40">
          Duration
        </span>
        <span className="font-label text-[10px] uppercase tracking-[0.18em] text-foreground/70 tabular-nums">
          {lo} – {hi >= max ? `${max}+` : hi} min
        </span>
      </div>

      <div className="relative h-6 select-none">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-foreground/15" />
        {/* Active fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-px bg-foreground/70"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi);
            onChange([v, hi]);
          }}
          className="catalogue-range absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
          aria-label="Minimum duration"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo);
            onChange([lo, v]);
          }}
          className="catalogue-range absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
          aria-label="Maximum duration"
        />
      </div>

      <style jsx>{`
        .catalogue-range::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 9999px;
          background: #1a1a1a;
          border: 2px solid #f4f1ea;
          box-shadow: 0 0 0 1px rgba(26, 26, 26, 0.25);
          cursor: pointer;
          margin-top: 0;
        }
        .catalogue-range::-moz-range-thumb {
          pointer-events: auto;
          height: 14px;
          width: 14px;
          border-radius: 9999px;
          background: #1a1a1a;
          border: 2px solid #f4f1ea;
          box-shadow: 0 0 0 1px rgba(26, 26, 26, 0.25);
          cursor: pointer;
        }
        .catalogue-range::-webkit-slider-runnable-track,
        .catalogue-range::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}

/* ── Entry Card ─────────────────────────────────────────────────── */
function EntryCard({
  work,
  audioRef,
  activeSrc,
  setActiveSrc,
}: {
  work: CatalogueWork;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  activeSrc: string | null;
  setActiveSrc: (s: string | null) => void;
}) {
  const premiereBits = [
    formatPremiereDate(work.premiereDate),
    work.premierePlace,
  ].filter(Boolean);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group py-12 border-b border-foreground/[0.06]"
    >
      {/* Top Line — Title + Year */}
      <div className="flex items-baseline justify-between gap-6 mb-4">
        <h2 className="font-headline text-[1.85rem] md:text-[2.4rem] leading-[1.15] text-foreground">
          {work.title}
        </h2>
        {work.year && (
          <span className="shrink-0 font-label text-[11px] uppercase tracking-[0.3em] text-foreground/40 tabular-nums">
            {work.year}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {work.subtitle && (
        <p className="font-headline italic text-base md:text-lg text-foreground/55 mb-5">
          {work.subtitle}
        </p>
      )}

      {/* Description */}
      {work.description && (
        <p className="font-body text-[15px] leading-[1.85] text-foreground/55 max-w-2xl mb-8 whitespace-pre-line">
          {work.description}
        </p>
      )}

      {/* Metadata Block */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl mb-8">
        {work.genre && (
          <MetaRow label="Genre" value={work.genre} />
        )}
        {work.instrumentation && (
          <MetaRow label="Instrumentation" value={work.instrumentation} />
        )}
        {(work.durationDisplay ||
          typeof work.durationMinutes === "number") && (
          <MetaRow
            label="Duration"
            value={
              work.durationDisplay ??
              `${work.durationMinutes} min`
            }
          />
        )}
        {typeof work.movements === "number" && (
          <MetaRow label="Movements" value={String(work.movements)} />
        )}
        {(premiereBits.length > 0 || work.performers) && (
          <div className="sm:col-span-2 pt-3 border-t border-foreground/[0.05]">
            <dt className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/50 mb-2">
              World Premiere
            </dt>
            <dd className="font-body text-[13px] leading-[1.7] text-foreground/65">
              {premiereBits.length > 0 && (
                <div>{premiereBits.join(" — ")}</div>
              )}
              {work.performers && (
                <div className="text-foreground/45 whitespace-pre-line">
                  {work.performers}
                </div>
              )}
            </dd>
          </div>
        )}
      </dl>

      {/* Footer Action Row */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <span className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.25em]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              work.published ? "bg-tertiary" : "bg-foreground/25"
            }`}
          />
          <span className="text-foreground/55">
            {work.published ? "Published" : "Unpublished"}
          </span>
        </span>

        {work.watchLink && (
          <a
            href={work.watchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground transition-colors"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full border border-foreground/15">
              <span className="material-symbols-outlined text-[14px]">
                play_circle
              </span>
            </span>
            <span>Watch</span>
          </a>
        )}

        {work.audioUrl && (
          <PlayButton
            src={work.audioUrl}
            audioRef={audioRef}
            setActiveSrc={setActiveSrc}
            activeSrc={activeSrc}
          />
        )}
      </div>
    </motion.article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/50 mb-1">
        {label}
      </dt>
      <dd className="font-body text-[13px] leading-[1.6] text-foreground/75">
        {value}
      </dd>
    </div>
  );
}

/* ── Main filter shell ───────────────────────────────────────────── */
export default function CatalogueFilter({
  works,
}: {
  works: CatalogueWork[];
}) {
  const [instrumentation, setInstrumentation] = useState<string>("All");
  const [genre, setGenre] = useState<string>("All");
  const [duration, setDuration] = useState<[number, number]>([
    DURATION_MIN,
    DURATION_MAX,
  ]);
  const [sort, setSort] = useState<SortKey>("yearDesc");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    const el = audioRef.current;
    const onEnd = () => setActiveSrc(null);
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, []);

  const filtered = useMemo(() => {
    const [lo, hi] = duration;
    const includeOver = hi >= DURATION_MAX;

    const list = works.filter((w) => {
      if (instrumentation !== "All" && w.instrumentation !== instrumentation)
        return false;
      if (genre !== "All" && w.genre !== genre) return false;

      const m = w.durationMinutes;
      if (typeof m === "number") {
        if (m < lo) return false;
        if (!includeOver && m > hi) return false;
      }
      return true;
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "yearDesc":
          return (b.year ?? "").localeCompare(a.year ?? "");
        case "yearAsc":
          return (a.year ?? "").localeCompare(b.year ?? "");
        case "titleAsc":
          return a.title.localeCompare(b.title);
        case "durationDesc":
          return (b.durationMinutes ?? -1) - (a.durationMinutes ?? -1);
        case "durationAsc":
          return (a.durationMinutes ?? Infinity) -
            (b.durationMinutes ?? Infinity);
        case "movementsDesc":
          return (b.movements ?? -1) - (a.movements ?? -1);
        case "movementsAsc":
          return (a.movements ?? Infinity) - (b.movements ?? Infinity);
      }
    });
    return sorted;
  }, [works, instrumentation, genre, duration, sort]);

  return (
    <>
      {/* hidden global audio element */}
      <audio ref={audioRef} preload="none" className="hidden" />

      {/* ── Filter Bar ── */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8 pb-10 border-b border-foreground/[0.06]">
          <SelectField
            className="md:col-span-3"
            label="Instrumentation"
            value={instrumentation}
            onChange={setInstrumentation}
            options={["All", ...INSTRUMENTATIONS]}
          />
          <SelectField
            className="md:col-span-3"
            label="Genre"
            value={genre}
            onChange={setGenre}
            options={["All", ...GENRES]}
          />

          <div className="md:col-span-4 flex items-end">
            <DurationRange
              min={DURATION_MIN}
              max={DURATION_MAX}
              value={duration}
              onChange={setDuration}
            />
          </div>

          <SelectField
            className="md:col-span-2"
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={SORTS.map((s) => s.value)}
            renderOption={(v) =>
              SORTS.find((s) => s.value === v)?.label ?? v
            }
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            {filtered.length}{" "}
            {filtered.length === 1 ? "Work" : "Works"}
          </p>
          {(instrumentation !== "All" ||
            genre !== "All" ||
            duration[0] !== DURATION_MIN ||
            duration[1] !== DURATION_MAX) && (
            <button
              onClick={() => {
                setInstrumentation("All");
                setGenre("All");
                setDuration([DURATION_MIN, DURATION_MAX]);
              }}
              className="font-label text-[10px] uppercase tracking-[0.25em] text-foreground/40 hover:text-foreground transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* ── List ── */}
      <section className="max-w-5xl mx-auto px-6 md:px-8">
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 text-center"
              >
                <p className="font-body text-sm text-foreground/30">
                  No works match the current filters.
                </p>
              </motion.div>
            ) : (
              filtered.map((w) => (
                <EntryCard
                  key={w._id}
                  work={w}
                  audioRef={audioRef}
                  activeSrc={activeSrc}
                  setActiveSrc={setActiveSrc}
                />
              ))
            )}
          </AnimatePresence>
        </LayoutGroup>
      </section>
    </>
  );
}

/* ── Reusable underline-style select ─────────────────────────────── */
function SelectField({
  label,
  value,
  onChange,
  options,
  renderOption,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | string[];
  renderOption?: (v: string) => string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col ${className}`}>
      <span className="font-label text-[10px] uppercase tracking-[0.22em] text-foreground/40 mb-3">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-transparent border-0 border-b border-foreground/[0.12] focus:border-foreground/40 focus:ring-0 pl-0 pr-8 py-2 font-body text-sm text-foreground cursor-pointer transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {renderOption ? renderOption(opt) : opt}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 text-sm pointer-events-none">
          expand_more
        </span>
      </div>
    </label>
  );
}

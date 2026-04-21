"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AudioPlayer from "./AudioPlayer";
import { urlFor } from "@/sanity/image";

interface Track {
  _key: string;
  title: string;
  audioUrl?: string;
}

interface Release {
  _id: string;
  title: string;
  releaseType?: "album" | "single";
  album?: string;
  artist?: string;
  instrumentation?: string;
  label?: string;
  country?: string;
  albumCover?: { asset: { _ref: string } };
  audioUrl?: string;
  tracks?: Track[];
  purchaseUrl?: string;
  shareUrl?: string;
  publishDate?: string;
}

const PER_PAGE = 10;

const seedReleases: Release[] = [
  {
    _id: "seed-1",
    title: "Symphony of Sand",
    releaseType: "album",
    album: "Symphony of Sand",
    artist: "Orchestre Symphonique National",
    instrumentation: "Full Orchestra",
    label: "Éditions Andalouses",
    country: "Algeria",
    publishDate: "2012-03-15",
    tracks: [
      { _key: "t1", title: "I. Sirocco" },
      { _key: "t2", title: "II. The Long Dune" },
      { _key: "t3", title: "III. Call to Tlemcen" },
    ],
  },
  {
    _id: "seed-2",
    title: "Echoes of the Casbah",
    releaseType: "single",
    artist: "Sergio Puccini",
    instrumentation: "Solo Guitar",
    label: "Independent",
    country: "Algeria",
    publishDate: "2016-09-22",
  },
  {
    _id: "seed-3",
    title: "The Trans-Saharan Scale",
    releaseType: "single",
    artist: "Salim Dada",
    instrumentation: "Field Recording",
    label: "Archives du Sud",
    country: "Algeria / Mali",
    publishDate: "2018-11-04",
  },
];

function CartIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M3 4h3l2.5 11.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="10" cy="20.5" r="1.1" />
      <circle cx="17" cy="20.5" r="1.1" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M12 3v13" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 14v6h14v-6" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </motion.svg>
  );
}

function ActionLinks({
  title,
  purchaseUrl,
  shareUrl,
}: {
  title: string;
  purchaseUrl?: string;
  shareUrl?: string;
}) {
  const handleShare = async () => {
    const url =
      shareUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // no-op
      }
    }
  };

  if (!purchaseUrl && !shareUrl) return null;

  return (
    <div className="flex items-center gap-5 mt-6">
      {purchaseUrl && (
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface/50 hover:text-on-surface transition-colors"
        >
          <CartIcon />
          <span>Purchase</span>
        </a>
      )}
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface/50 hover:text-on-surface transition-colors"
      >
        <ShareIcon />
        <span>Share</span>
      </button>
    </div>
  );
}

function CoverArt({
  release,
  useSeed,
}: {
  release: Release;
  useSeed: boolean;
}) {
  return (
    <div className="p-1.5 border border-primary/15 bg-surface-container-lowest rounded-sm">
      <div className="aspect-square w-full bg-surface-container-low relative overflow-hidden rounded-sm">
        {release.albumCover && !useSeed ? (
          <Image
            src={urlFor(release.albumCover).width(640).height(640).url()}
            alt={release.title}
            fill
            sizes="280px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface/10 text-6xl">
              album
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecsList({ release }: { release: Release }) {
  const items: { label: string; value?: string }[] = [
    { label: "Album", value: release.album },
    { label: "Artist", value: release.artist },
    { label: "Instrumentation", value: release.instrumentation },
    { label: "Label", value: release.label },
    { label: "Country", value: release.country },
  ];
  const filtered = items.filter((i) => i.value);
  if (filtered.length === 0) return null;
  return (
    <dl className="font-body text-[12px] leading-[1.8] text-on-surface/70 space-y-1 max-w-xl">
      {filtered.map((item) => (
        <div key={item.label} className="flex gap-1.5">
          <dt className="text-on-surface/40">{item.label}:</dt>
          <dd className="text-on-surface/80">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SingleRow({
  release,
  useSeed,
  activeTrackId,
  setActiveTrackId,
}: {
  release: Release;
  useSeed: boolean;
  activeTrackId: string | null;
  setActiveTrackId: (id: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-[280px] shrink-0 space-y-6">
        <CoverArt release={release} useSeed={useSeed} />
        {release.audioUrl && !useSeed ? (
          <AudioPlayer
            src={release.audioUrl}
            trackId={release._id}
            activeTrackId={activeTrackId}
            onPlay={setActiveTrackId}
          />
        ) : (
          <PlaceholderPlayer />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif-brand text-xl md:text-[1.4rem] text-on-surface/90 mb-5 leading-snug">
          {release.title}
        </h3>
        <SpecsList release={release} />
        <ActionLinks
          title={release.title}
          purchaseUrl={release.purchaseUrl}
          shareUrl={release.shareUrl}
        />
      </div>
    </div>
  );
}

function AlbumRow({
  release,
  useSeed,
  activeTrackId,
  setActiveTrackId,
}: {
  release: Release;
  useSeed: boolean;
  activeTrackId: string | null;
  setActiveTrackId: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const tracks = release.tracks ?? [];

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-[280px] shrink-0">
        <CoverArt release={release} useSeed={useSeed} />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-serif-brand text-xl md:text-[1.4rem] text-on-surface/90 mb-5 leading-snug">
          {release.title}
        </h3>
        <div className="mb-8">
          <SpecsList release={release} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="self-start flex items-center gap-3 px-4 py-2.5 border border-primary/20 hover:border-primary/40 transition-colors font-label text-[10px] uppercase tracking-[0.2em] text-on-surface/60 hover:text-on-surface"
        >
          <span>{open ? "Hide Tracklist" : "View Tracklist"}</span>
          <ChevronIcon open={open} />
        </button>

        {/* Keep tracks mounted so audio continues when collapsed */}
        <motion.div
          initial={false}
          animate={{
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: "hidden" }}
          aria-hidden={!open}
        >
          <ol className="mt-6 divide-y divide-primary/10 border-t border-primary/15">
            {tracks.map((track, idx) => {
              const trackKey = `${release._id}:${track._key}`;
              return (
                <li key={track._key} className="py-4">
                  <div className="flex items-start gap-4">
                    <span className="font-label text-[10px] tracking-[0.2em] text-primary/30 pt-2 w-6 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif-brand text-[15px] text-on-surface/85 mb-3 leading-snug">
                        {track.title}
                      </p>
                      {track.audioUrl && !useSeed ? (
                        <AudioPlayer
                          src={track.audioUrl}
                          trackId={trackKey}
                          activeTrackId={activeTrackId}
                          onPlay={setActiveTrackId}
                        />
                      ) : (
                        <PlaceholderPlayer />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>

        <ActionLinks
          title={release.title}
          purchaseUrl={release.purchaseUrl}
          shareUrl={release.shareUrl}
        />
      </div>
    </div>
  );
}

function PlaceholderPlayer() {
  return (
    <div className="flex items-center gap-5 w-full">
      <div className="w-9 h-9 flex items-center justify-center shrink-0 border border-primary/15">
        <span className="material-symbols-outlined text-primary/25 text-base">
          play_arrow
        </span>
      </div>
      <div className="flex-1">
        <div className="w-full h-[2px] bg-primary/10" />
        <p className="font-label text-[9px] tracking-wider text-primary/25 mt-1.5">
          Audio available in Backstage
        </p>
      </div>
    </div>
  );
}

export default function Discography({ releases }: { releases: Release[] }) {
  const items = releases.length > 0 ? releases : seedReleases;
  const useSeed = releases.length === 0;

  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const paginated = items.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  return (
    <div>
      <div className="space-y-0">
        {paginated.map((release, i) => {
          const isAlbum = release.releaseType === "album";
          return (
            <article
              key={release._id}
              className={`py-20 ${
                i < paginated.length - 1 ? "border-b border-primary/15" : ""
              }`}
            >
              {isAlbum ? (
                <AlbumRow
                  release={release}
                  useSeed={useSeed}
                  activeTrackId={activeTrackId}
                  setActiveTrackId={setActiveTrackId}
                />
              ) : (
                <SingleRow
                  release={release}
                  useSeed={useSeed}
                  activeTrackId={activeTrackId}
                  setActiveTrackId={setActiveTrackId}
                />
              )}
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-20">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 text-on-surface/30 hover:text-on-surface disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-9 h-9 font-label text-[11px] transition-colors duration-200 ${
                num === currentPage
                  ? "text-on-surface border border-on-surface/20"
                  : "text-on-surface/30 hover:text-on-surface"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 text-on-surface/30 hover:text-on-surface disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

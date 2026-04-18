"use client";

import { useState } from "react";
import Image from "next/image";
import AudioPlayer from "./AudioPlayer";
import { urlFor } from "@/sanity/image";

interface AudioTrack {
  _id: string;
  title: string;
  description?: string;
  albumCover?: { asset: { _ref: string } };
  audioUrl?: string;
  publishDate?: string;
}

const PER_PAGE = 10;

// Seed data for when Sanity is empty
const seedTracks: AudioTrack[] = [
  {
    _id: "seed-1",
    title: "Symphony of Sand \u2014 I. Sirocco",
    description:
      "The opening movement of the Mediterranean Symphony Cycle, premiered at the Orchestre Symphonique National in 2012. Inspired by the desert winds that carry ancient melodies across the Sahara.",
    publishDate: "2012-03-15",
  },
  {
    _id: "seed-2",
    title: "Echoes of the Casbah",
    description:
      "Solo guitar compositions recorded in the natural acoustics of Algiers\u2019 historic Casbah. A meditation on urban silence and the memory embedded in stone.",
    publishDate: "2016-09-22",
  },
  {
    _id: "seed-3",
    title: "The Trans-Saharan Scale \u2014 Field Recording",
    description:
      "An archival field recording documenting the migration of microtonal melodies from the Sahel to the Mediterranean coast, captured during the 2018 UNESCO expedition.",
    publishDate: "2018-11-04",
  },
];

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export default function AudioGallery({ tracks }: { tracks: AudioTrack[] }) {
  const items = tracks.length > 0 ? tracks : seedTracks;
  const useSeed = tracks.length === 0;

  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const paginated = items.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  return (
    <div>
      {/* Track List */}
      <div className="space-y-0">
        {paginated.map((track, i) => (
          <article
            key={track._id}
            className={`py-14 ${
              i < paginated.length - 1
                ? "border-b border-on-surface/[0.06]"
                : ""
            }`}
          >
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left: Cover + Player */}
              <div className="w-full md:w-[280px] shrink-0 space-y-6">
                {/* Album Cover */}
                <div className="aspect-square w-full bg-surface-container-low relative overflow-hidden">
                  {track.albumCover && !useSeed ? (
                    <Image
                      src={urlFor(track.albumCover).width(560).height(560).url()}
                      alt={track.title}
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

                {/* Player */}
                {track.audioUrl && !useSeed ? (
                  <AudioPlayer
                    src={track.audioUrl}
                    trackId={track._id}
                    activeTrackId={activeTrackId}
                    onPlay={setActiveTrackId}
                  />
                ) : (
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-on-surface/10">
                      <span className="material-symbols-outlined text-on-surface/20 text-lg">
                        play_arrow
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-[3px] bg-on-surface/[0.06]" />
                      <p className="font-label text-[9px] tracking-wider text-on-surface/20 mt-1.5">
                        Audio available in Backstage
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className="flex-1 flex flex-col justify-center">
                {track.publishDate && (
                  <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface/25 mb-4">
                    {formatDate(track.publishDate)}
                  </p>
                )}
                <h3 className="font-serif-brand text-2xl md:text-[1.75rem] text-on-surface mb-5 leading-snug">
                  {track.title}
                </h3>
                {track.description && (
                  <p className="font-body text-sm leading-[1.9] text-on-surface-variant/60 max-w-xl">
                    {track.description}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
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

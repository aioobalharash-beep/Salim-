"use client";

import { useState } from "react";

/* Lightweight YouTube facade: shows the poster thumbnail instantly (so the
 * block is never a blank box on mobile) and only mounts the heavy iframe when
 * the visitor taps play — which also autoplays on demand. */
export default function ProjectYouTube({
  id,
  start,
  title,
}: {
  id: string;
  start?: number | null;
  title?: string | null;
}) {
  const [playing, setPlaying] = useState(false);

  const startParam =
    typeof start === "number" && start > 0 ? `&start=${Math.floor(start)}` : "";
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1${startParam}`;
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-on-surface">
      {playing ? (
        <iframe
          src={src}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title || "video"}`}
          className="group absolute inset-0 w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={title || "Video thumbnail"}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-on-surface/10 group-hover:bg-on-surface/20 transition-colors duration-200">
            <span className="w-16 h-16 rounded-full bg-on-surface/65 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
              <span className="material-symbols-outlined text-surface text-[34px] leading-none ml-0.5">
                play_arrow
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

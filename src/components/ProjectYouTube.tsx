"use client";

import { useEffect, useState } from "react";

/* YouTube embed that adapts to viewport:
 *  - Mobile: a lightweight facade — the poster thumbnail shows instantly (so
 *    the block is never a blank box) and the heavy iframe only mounts, and
 *    autoplays, when the visitor taps play.
 *  - Desktop: the player loads immediately (ready to play, not autoplaying),
 *    since eager iframes are fine on desktop. */
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
  const [isDesktop, setIsDesktop] = useState(false);

  // Resolved after mount, so server + first client render both show the facade
  // (no hydration mismatch); desktop then swaps in the live player.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showIframe = playing || isDesktop;

  const startParam =
    typeof start === "number" && start > 0 ? `&start=${Math.floor(start)}` : "";
  // Autoplay only on an explicit tap — never when desktop auto-loads.
  const autoplayParam = playing ? "&autoplay=1" : "";
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1${autoplayParam}${startParam}`;
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-on-surface">
      {showIframe ? (
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

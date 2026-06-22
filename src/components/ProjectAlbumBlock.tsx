"use client";

import { useState } from "react";
import Image from "next/image";
import AudioPlayer from "./AudioPlayer";

interface AlbumTrack {
  trackTitle: string | null;
  audioUrl: string | null;
}

/* Project discography block — album art on the left, and a numbered track list
 * on the right that uses the exact same AudioPlayer as the Discography page
 * (single-play-at-a-time, custom scrubber, auto-advance). */
export default function ProjectAlbumBlock({
  albumTitle,
  albumSubtitle,
  artUrl,
  artAlt,
  tracks,
}: {
  albumTitle: string | null;
  albumSubtitle?: string | null;
  artUrl: string | null;
  artAlt: string;
  tracks: AlbumTrack[];
}) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const playable = tracks.filter((t) => t.audioUrl);

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto my-16 p-6">
      {/* Left — album art in a sharp square bounding box */}
      <div className="w-full lg:w-1/3">
        <div className="relative aspect-square overflow-hidden shadow-sm bg-on-surface/[0.05]">
          {artUrl && (
            <Image
              src={artUrl}
              alt={artAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Right — title, subtitle, track list */}
      <div className="w-full lg:w-2/3">
        {albumTitle && (
          <h3 className="font-headline text-xl md:text-2xl text-foreground">
            {albumTitle}
          </h3>
        )}
        {albumSubtitle && (
          <p className="font-label text-xs uppercase tracking-widest text-foreground/40 mt-1.5">
            {albumSubtitle}
          </p>
        )}

        {playable.length > 0 && (
          <ol className="mt-6 divide-y divide-primary/10 border-t border-primary/15">
            {playable.map((track, idx) => {
              const trackKey = `${idx}:${track.audioUrl}`;
              const next = playable[idx + 1];
              const nextKey = next ? `${idx + 1}:${next.audioUrl}` : null;
              return (
                <li key={trackKey} className="py-4">
                  <div className="flex items-start gap-4">
                    <span className="font-label text-[10px] tracking-[0.2em] text-primary/30 pt-2 w-6 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif-brand text-[15px] text-on-surface/85 mb-3 leading-snug">
                        {track.trackTitle}
                      </p>
                      <AudioPlayer
                        src={track.audioUrl!}
                        trackId={trackKey}
                        activeTrackId={activeTrackId}
                        onPlay={setActiveTrackId}
                        onEnded={
                          nextKey
                            ? () => setActiveTrackId(nextKey)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

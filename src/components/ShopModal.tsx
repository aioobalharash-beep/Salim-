"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import ShopCarousel, { type ShopSlide } from "./ShopCarousel";

export type ShopInfoRow = { label: string; value: string };
export type ShopAudioTrack = {
  trackTitle: string;
  trackDescription?: string;
  audioUrl: string;
};

interface ShopModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  title: string;
  priceText: string;
  description?: string;
  purchaseUrl: string;
  slides: ShopSlide[];
  additionalInfo?: ShopInfoRow[];
  audioTracks?: ShopAudioTrack[];
}

export default function ShopModal({
  open,
  onClose,
  productId,
  title,
  priceText,
  description,
  purchaseUrl,
  slides,
  additionalInfo,
  audioTracks,
}: ShopModalProps) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setActiveTrackId(null);
  }, [open]);

  const infoRows = (additionalInfo ?? []).filter(
    (row) => row.label && row.value,
  );
  const tracks = (audioTracks ?? []).filter((t) => t.audioUrl);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-surface shadow-card"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-colors bg-surface/80 backdrop-blur-sm rounded-full"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Column 1 — Visuals carousel */}
              <div className="relative w-full h-[400px] lg:h-[640px] bg-background">
                <ShopCarousel
                  slides={slides}
                  title={title}
                  fit="contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Column 2 — Commerce + metadata split */}
              <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-10">
                {/* Left sub-column — price + buy now */}
                <div className="flex flex-col">
                  <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mb-2">
                    Price
                  </p>
                  <p className="font-label text-3xl font-semibold text-on-surface tracking-tight mb-6">
                    €{priceText}
                  </p>
                  <a
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-3.5 bg-on-surface text-background font-label text-[11px] lowercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                  >
                    buy now
                  </a>
                </div>

                {/* Right sub-column — description, table, audio */}
                <div className="flex flex-col">
                  <h2 className="font-serif-brand text-2xl md:text-3xl text-on-surface mb-4 leading-tight">
                    {title}
                  </h2>

                  {description && (
                    <p className="font-body text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">
                      {description}
                    </p>
                  )}

                  {infoRows.length > 0 && (
                    <div className="mt-8">
                      <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mb-3">
                        Additional Information
                      </p>
                      <dl className="divide-y divide-outline-variant/20 border-t border-b border-outline-variant/20">
                        {infoRows.map((row, i) => (
                          <div
                            key={`${row.label}-${i}`}
                            className="grid grid-cols-[1fr_1fr] py-3 gap-4"
                          >
                            <dt className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                              {row.label}
                            </dt>
                            <dd className="font-body text-sm italic text-on-surface text-right">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {tracks.length > 0 && (
                    <div className="mt-8">
                      <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mb-4">
                        Audio Samples
                      </p>
                      <div className="flex flex-col divide-y divide-outline-variant/15">
                        {tracks.map((track, i) => {
                          const trackId = `${productId}-track-${i}`;
                          return (
                            <div
                              key={trackId}
                              className="py-5 first:pt-0 last:pb-0"
                            >
                              <div className="mb-2">
                                <h3 className="font-serif-brand text-base text-on-surface leading-snug">
                                  {track.trackTitle}
                                </h3>
                                {track.trackDescription && (
                                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                                    {track.trackDescription}
                                  </p>
                                )}
                              </div>
                              <AudioPlayer
                                src={track.audioUrl}
                                trackId={trackId}
                                activeTrackId={activeTrackId}
                                onPlay={setActiveTrackId}
                                onEnded={() => setActiveTrackId(null)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

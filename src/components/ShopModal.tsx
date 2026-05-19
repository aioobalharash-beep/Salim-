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
  const singleTrack = tracks.length === 1;

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
            className="relative w-full max-w-3xl max-h-[85vh] bg-surface shadow-card"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-colors bg-surface/80 backdrop-blur-sm rounded-full"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="overflow-y-auto max-h-[85vh] px-8 py-12">
            {/* 1 — Header imagery, centered carousel */}
            <div className="mx-auto w-full max-w-xl">
              <div className="relative w-full h-[360px] md:h-[480px] bg-[#fbfaf7]">
                <ShopCarousel
                  slides={slides}
                  title={title}
                  fit="contain"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              </div>
            </div>

            {/* 2 — Action bar: price + buy now, centered */}
            <div className="mt-10 mx-auto max-w-md flex flex-col items-center text-center">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mb-2">
                Price
              </p>
              <p className="font-label text-3xl md:text-4xl font-semibold text-on-surface tracking-tight mb-6">
                €{priceText}
              </p>
              <a
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full max-w-xs py-3.5 bg-on-surface text-background font-label text-[11px] lowercase tracking-[0.25em] hover:opacity-90 transition-opacity"
              >
                buy now
              </a>
            </div>

            {/* 3 — Metadata header: title, left-aligned */}
            <h2 className="mt-14 font-serif-brand text-2xl md:text-3xl text-on-surface leading-tight text-left w-full">
              {title}
            </h2>

            {/* 4 — Description, centered */}
            {description && (
              <p className="mt-6 mx-auto max-w-2xl font-body text-sm md:text-base leading-relaxed text-on-surface-variant text-center whitespace-pre-line">
                {description}
              </p>
            )}

            {/* 5 — Audio experience */}
            {tracks.length > 0 && (
              <div
                className={`mt-12 ${
                  singleTrack
                    ? "flex flex-col items-center text-center mx-auto max-w-md"
                    : "mx-auto max-w-xl flex flex-col divide-y divide-outline-variant/15"
                }`}
              >
                {tracks.map((track, i) => {
                  const trackId = `${productId}-track-${i}`;
                  return (
                    <div
                      key={trackId}
                      className={
                        singleTrack
                          ? "w-full flex flex-col items-center text-center"
                          : "w-full py-5 first:pt-0 last:pb-0"
                      }
                    >
                      <h3 className="font-serif-brand text-base text-on-surface leading-snug">
                        {track.trackTitle}
                      </h3>
                      {track.trackDescription && (
                        <p className="font-body text-xs text-on-surface-variant mt-0.5">
                          {track.trackDescription}
                        </p>
                      )}
                      <div
                        className={`mt-3 w-full ${
                          singleTrack ? "max-w-sm mx-auto" : ""
                        }`}
                      >
                        <AudioPlayer
                          src={track.audioUrl}
                          trackId={trackId}
                          activeTrackId={activeTrackId}
                          onPlay={setActiveTrackId}
                          onEnded={() => setActiveTrackId(null)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 6 — Technical specifications: left label / right italic value, divided rows */}
            {infoRows.length > 0 && (
              <div className="mt-14 mx-auto max-w-2xl">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mb-4 text-left">
                  Additional Information
                </p>
                <dl className="border-t border-outline-variant/25">
                  {infoRows.map((row, i) => (
                    <div
                      key={`${row.label}-${i}`}
                      className="flex items-baseline justify-between gap-6 py-3 border-b border-outline-variant/25"
                    >
                      <dt className="font-label text-[11px] uppercase tracking-[0.25em] text-on-surface-variant">
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

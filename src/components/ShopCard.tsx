"use client";

import { useState } from "react";
import ShopCarousel, { type ShopSlide } from "./ShopCarousel";
import ShopModal, {
  type ShopAudioTrack,
  type ShopInfoRow,
} from "./ShopModal";

interface ShopCardProps {
  productId: string;
  title: string;
  priceText: string;
  description?: string;
  purchaseUrl: string;
  slides: ShopSlide[];
  additionalInfo?: ShopInfoRow[];
  audioTracks?: ShopAudioTrack[];
}

export default function ShopCard({
  productId,
  title,
  priceText,
  description,
  purchaseUrl,
  slides,
  additionalInfo,
  audioTracks,
}: ShopCardProps) {
  const [open, setOpen] = useState(false);

  const snippet =
    description && description.length > 160
      ? `${description.slice(0, 157).trimEnd()}…`
      : description;

  return (
    <>
      <article className="w-full flex flex-col h-full">
        {/* Top region — clickable quick-view trigger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Quick view: ${title}`}
          className="text-left w-full flex flex-col group"
        >
          {/* Image frame: w-full + fixed responsive height locks every card
              in the row to the same horizontal footprint. object-contain on
              the carousel preserves the native aspect of every asset and
              centers it on both axes inside the frame, so square, portrait,
              and landscape covers all share the same vertical centre line. */}
          <div className="relative w-full h-[75vw] sm:h-[340px] lg:h-[380px] overflow-hidden bg-transparent">
            <ShopCarousel slides={slides} title={title} fit="contain" />
          </div>

          <div className="pt-5 flex flex-col">
            <h2 className="font-serif-brand text-lg text-on-surface mb-2 leading-snug group-hover:text-on-surface/80 transition-colors">
              {title}
            </h2>
            {snippet && (
              <p className="font-body text-xs leading-relaxed text-on-surface-variant">
                {snippet}
              </p>
            )}
          </div>
        </button>

        {/* Action bar — price + buy now, locked to the bottom of the card.
            mt-auto pushes it past variable-length descriptions so every
            row of cards shares an identical action-bar baseline. */}
        <div className="mt-auto pt-5 flex flex-col">
          <p className="font-label text-xl font-semibold text-on-surface mb-3 tracking-tight">
            €{priceText}
          </p>
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-2.5 border border-on-surface/20 text-on-surface font-label text-[10px] lowercase tracking-widest hover:bg-on-surface hover:text-background transition-colors"
          >
            buy now
          </a>
        </div>
      </article>

      <ShopModal
        open={open}
        onClose={() => setOpen(false)}
        productId={productId}
        title={title}
        priceText={priceText}
        description={description}
        purchaseUrl={purchaseUrl}
        slides={slides}
        additionalInfo={additionalInfo}
        audioTracks={audioTracks}
      />
    </>
  );
}

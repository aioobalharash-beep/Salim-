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
      <article className="w-full max-w-xs sm:max-w-none flex flex-col h-full justify-between">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Quick view: ${title}`}
          className="text-left w-full flex flex-col group"
        >
          <div className="relative w-full h-[320px] md:h-[380px] overflow-hidden bg-transparent">
            <ShopCarousel slides={slides} title={title} fit="contain" />
          </div>

          <div className="pt-4 flex flex-col">
            <h2 className="font-serif-brand text-lg text-on-surface mb-1 leading-snug group-hover:text-on-surface/80 transition-colors">
              {title}
            </h2>
            <p className="font-label text-xl font-semibold text-on-surface mb-2 tracking-tight">
              €{priceText}
            </p>
            {snippet && (
              <p className="font-body text-xs leading-relaxed text-on-surface-variant mb-4">
                {snippet}
              </p>
            )}
          </div>
        </button>

        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center w-full py-2.5 border border-on-surface/20 text-on-surface font-label text-[10px] lowercase tracking-widest hover:bg-on-surface hover:text-background transition-colors"
        >
          buy now
        </a>
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

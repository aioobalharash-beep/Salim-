"use client";

import Script from "next/script";

/**
 * Closing call-to-action for a service landing page.
 *
 * The form is embedded inline (no modal, no trigger button). To avoid the
 * cramped internal scrollbar a fixed-height iframe produces, we use Tally's
 * official embed: an iframe carrying `data-tally-src` plus the embed.js
 * widget, which listens for the form's height and resizes the iframe to fit
 * its content — so the whole form is visible with no inner scroll.
 */

const TALLY_EMBED_SRC = "https://tally.so/widgets/embed.js";

/* Normalise any Tally link (share `/r/<id>` or embed `/embed/<id>`) into a
 * proper embed URL with the params needed for a clean, auto-height embed. */
function toTallyEmbed(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("tally.so")) return url;
    const id = u.pathname.match(/\/(?:r|embed)\/([^/?#]+)/)?.[1];
    if (!id) return url;
    const params = new URLSearchParams({
      alignLeft: "1",
      hideTitle: "1",
      transparentBackground: "1",
      dynamicHeight: "1",
    });
    return `https://tally.so/embed/${id}?${params.toString()}`;
  } catch {
    return null;
  }
}

// Ask Tally to (re)process any data-tally-src iframes on the page.
function loadTallyEmbeds() {
  const Tally = (window as unknown as { Tally?: { loadEmbeds: () => void } })
    .Tally;
  if (Tally) Tally.loadEmbeds();
}

export default function ServiceCtaForm({
  headline,
  description,
  tallyUrl,
}: {
  headline?: string | null;
  description?: string | null;
  tallyUrl?: string | null;
}) {
  const embedSrc = toTallyEmbed(tallyUrl);

  // Defensive: nothing authored → render nothing.
  if (!headline && !description && !embedSrc) return null;

  return (
    <section className="bg-surface-container-low mt-24 md:mt-32">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
        {headline && (
          <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl font-light text-foreground leading-tight">
            {headline}
          </h2>
        )}
        {description && (
          <p className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl mx-auto mt-6 whitespace-pre-line">
            {description}
          </p>
        )}

        {embedSrc && (
          <div className="mt-12 md:mt-16 text-left">
            <iframe
              data-tally-src={embedSrc}
              loading="lazy"
              width="100%"
              height={500}
              title={headline || "Inquiry form"}
              className="w-full border-0 bg-transparent"
            />
            <Script
              src={TALLY_EMBED_SRC}
              strategy="lazyOnload"
              onReady={loadTallyEmbeds}
              onLoad={loadTallyEmbeds}
            />
          </div>
        )}
      </div>
    </section>
  );
}

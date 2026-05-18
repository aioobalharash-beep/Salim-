import type { Metadata } from "next";
import { urlFor, type SanityImageSource } from "./image";

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

type OgImageSource = SanityImageSource & {
  alt?: string;
  dimensions?: ImageDimensions;
};

export interface SeoSettings {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  ogImage?: OgImageSource | null;
}

interface BuildMetadataInput {
  seo?: SeoSettings | null;
  fallbackTitle: string;
  fallbackDescription?: string | null;
  fallbackImage?: (SanityImageSource & { dimensions?: ImageDimensions }) | null;
  titleSuffix?: string;
  url?: string;
  type?: "website" | "article";
}

const DEFAULT_SUFFIX = "Salim Dada";
const OG_MAX_EDGE = 1200;

export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  titleSuffix = DEFAULT_SUFFIX,
  url,
  type = "website",
}: BuildMetadataInput): Metadata {
  const baseTitle = seo?.metaTitle?.trim() || fallbackTitle;
  const title = titleSuffix ? `${baseTitle} — ${titleSuffix}` : baseTitle;
  const description =
    seo?.metaDescription?.trim() || fallbackDescription || undefined;
  const keywords = seo?.keywords?.length ? seo.keywords : undefined;

  const ogImageSource = seo?.ogImage ?? fallbackImage ?? null;
  const dims = (ogImageSource as { dimensions?: ImageDimensions } | null)
    ?.dimensions;

  // Serve OG images at their natural aspect ratio (capped at 1200 on the long
  // edge). Forcing a 1.91:1 crop mutilates square covers and portraits, which
  // is the typical art for these articles. LinkedIn / Facebook will pick the
  // appropriate card layout based on the declared width/height.
  let ogImageUrl: string | undefined;
  let ogImageWidth: number | undefined;
  let ogImageHeight: number | undefined;

  if (ogImageSource) {
    const aspectRatio = dims?.aspectRatio ?? 1; // assume square if unknown
    if (aspectRatio >= 1) {
      ogImageWidth = OG_MAX_EDGE;
      ogImageHeight = Math.round(OG_MAX_EDGE / aspectRatio);
      ogImageUrl = urlFor(ogImageSource)
        .width(OG_MAX_EDGE)
        .auto("format")
        .url();
    } else {
      ogImageHeight = OG_MAX_EDGE;
      ogImageWidth = Math.round(OG_MAX_EDGE * aspectRatio);
      ogImageUrl = urlFor(ogImageSource)
        .height(OG_MAX_EDGE)
        .auto("format")
        .url();
    }
  }

  const ogImageAlt =
    (seo?.ogImage && (seo.ogImage as { alt?: string }).alt) || baseTitle;

  // summary_large_image expects a wide (≥1.5:1) image; for square or portrait
  // art Twitter's compact "summary" card preserves the natural aspect ratio.
  const twitterCard: "summary" | "summary_large_image" = ogImageUrl
    ? (dims?.aspectRatio ?? 1) >= 1.5
      ? "summary_large_image"
      : "summary"
    : "summary";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type,
      url,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: ogImageWidth,
              height: ogImageHeight,
              alt: ogImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

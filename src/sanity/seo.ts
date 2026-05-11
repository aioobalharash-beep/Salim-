import type { Metadata } from "next";
import { urlFor, type SanityImageSource } from "./image";

export interface SeoSettings {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  ogImage?: (SanityImageSource & { alt?: string }) | null;
}

interface BuildMetadataInput {
  seo?: SeoSettings | null;
  fallbackTitle: string;
  fallbackDescription?: string | null;
  fallbackImage?: SanityImageSource | null;
  titleSuffix?: string;
  url?: string;
  type?: "website" | "article";
}

const DEFAULT_SUFFIX = "Salim Dada";

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
  const ogImageUrl = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit("crop").url()
    : undefined;
  const ogImageAlt =
    (seo?.ogImage && (seo.ogImage as { alt?: string }).alt) || baseTitle;

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
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: ogImageAlt }]
        : undefined,
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

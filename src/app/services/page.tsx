import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { servicesDirectoryQuery } from "@/sanity/queries";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";
import ServicesInquiryFAQ, {
  type FaqItem,
} from "@/components/ServicesInquiryFAQ";

export const revalidate = 60;

const FALLBACK_TITLE = "Services";
const FALLBACK_DESCRIPTION =
  "Music composition, composer mentorship, artistic direction, and cultural expertise — professional offerings tailored to your vision.";

/* ── Types — mirror servicesPage / servicePage schemas ─────────────────── */
type DirectoryImage = SanityImageSource & {
  alt?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

interface PromoBlock {
  title?: string | null;
  subtitle?: string | null;
  image?: DirectoryImage | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
}

interface ServicesPage {
  title?: string | null;
  subheader?: string | null;
  bannerImage?: DirectoryImage | null;
  promo?: PromoBlock | null;
  faqs?: FaqItem[] | null;
  showInquiry?: boolean | null;
  seo?: SeoSettings | null;
}

interface ServiceCard {
  _id: string;
  title: string;
  slug: string;
  summary?: string | null;
}

interface DirectoryData {
  page: ServicesPage | null;
  services: ServiceCard[] | null;
}

/* A Sanity image is only renderable once an asset is uploaded; urlFor() throws
 * on a sourceless image, so guard every image path. */
function hasAsset(img?: DirectoryImage | null): img is DirectoryImage {
  const asset = (img as { asset?: { _ref?: string; _id?: string } } | null)
    ?.asset;
  return !!(asset && (asset._ref || asset._id));
}

async function getData(): Promise<DirectoryData> {
  try {
    return (
      (await client.fetch<DirectoryData>(servicesDirectoryQuery)) ?? {
        page: null,
        services: [],
      }
    );
  } catch {
    return { page: null, services: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData();
  return buildMetadata({
    seo: page?.seo,
    fallbackTitle: page?.title || FALLBACK_TITLE,
    fallbackDescription: page?.subheader || FALLBACK_DESCRIPTION,
    fallbackImage: page?.bannerImage,
    url: "/services",
  });
}

/* ── Full-width banner ─────────────────────────────────────────────────── */
function Banner({ image }: { image?: DirectoryImage | null }) {
  if (!hasAsset(image)) return null;
  const dims = image.dimensions;
  const width = 2000;
  const height = dims ? Math.round(width / dims.aspectRatio) : 700;
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12 md:mt-16">
      <Image
        src={urlFor(image).width(width).quality(90).auto("format").url()}
        alt={image.alt || ""}
        width={width}
        height={height}
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

/* ── Promotional module ────────────────────────────────────────────────── */
function Promo({ data }: { data?: PromoBlock | null }) {
  // Defensive: an empty promotional section hides itself gracefully.
  if (!data || (!data.title && !data.subtitle && !hasAsset(data.image)))
    return null;

  const hasImage = hasAsset(data.image);
  const hasCta = data.ctaLabel && data.ctaLink;

  return (
    <section className="bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div
          className={`grid grid-cols-1 gap-10 md:gap-16 items-center ${
            hasImage ? "md:grid-cols-2" : ""
          }`}
        >
          <div>
            {data.title && (
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-6">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant max-w-xl whitespace-pre-line">
                {data.subtitle}
              </p>
            )}
            {hasCta && (
              <Link
                href={data.ctaLink!}
                className="mt-8 inline-block font-label text-[11px] uppercase tracking-[0.2em] px-8 py-3.5 border border-on-surface/20 text-on-surface hover:bg-on-surface hover:text-surface transition-all duration-300"
              >
                {data.ctaLabel}
              </Link>
            )}
          </div>

          {hasImage && (
            <div className="w-full">
              <Image
                src={urlFor(data.image!)
                  .width(1200)
                  .quality(90)
                  .auto("format")
                  .url()}
                alt={data.image!.alt || ""}
                width={1200}
                height={
                  data.image!.dimensions
                    ? Math.round(1200 / data.image!.dimensions.aspectRatio)
                    : 800
                }
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function ServicesPage() {
  const { page, services } = await getData();
  const cards = (services ?? []).filter((s) => s?.slug);
  const faqs = (page?.faqs ?? []).filter((f) => f?.question && f?.answer);
  const title = page?.title || FALLBACK_TITLE;

  return (
    <div className="min-h-screen bg-background pt-32 pb-0">
      {/* ── Centered header ── */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-5">
          Professional Offering
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-light text-foreground leading-[1.1]">
          {title}
        </h1>
        {page?.subheader && (
          <p className="font-body text-base md:text-lg leading-relaxed text-foreground/55 mt-6 whitespace-pre-line">
            {page.subheader}
          </p>
        )}
      </section>

      {/* ── Large horizontal banner ── */}
      <Banner image={page?.bannerImage} />

      {/* ── The 4 Core Services Matrix ── */}
      {cards.length > 0 && (
        <section className="px-6 md:px-8 mt-20 md:mt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {cards.map((service) => (
              <div
                key={service._id}
                className="relative border border-outline-variant/20 bg-surface p-10 md:p-12 pb-20 min-h-[300px] hover:bg-surface-container-low transition-colors duration-500"
              >
                <h2 className="font-serif-brand text-2xl md:text-3xl text-foreground mb-5">
                  {service.title}
                </h2>
                {service.summary && (
                  <p className="font-body text-sm md:text-base leading-relaxed text-on-surface-variant max-w-lg">
                    {service.summary}
                  </p>
                )}
                {/* Absolute-positioned "Read more →" pinned to the bottom-right,
                    safely routing to this service's dynamic landing path. */}
                <Link
                  href={`/services/${service.slug}`}
                  className="absolute bottom-10 right-10 md:bottom-12 md:right-12 font-label text-[10px] uppercase tracking-widest text-primary group inline-flex items-center gap-1"
                >
                  Read more
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Promotional module ── */}
      <div className="mt-20 md:mt-28">
        <Promo data={page?.promo} />
      </div>

      {/* ── Split panel: Inquiry (left) · FAQ (right) ── */}
      <ServicesInquiryFAQ
        showInquiry={page?.showInquiry ?? true}
        faqs={faqs}
      />
    </div>
  );
}

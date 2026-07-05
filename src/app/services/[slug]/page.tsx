import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import type { PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import {
  servicePageBySlugQuery,
  servicePagesListQuery,
} from "@/sanity/queries";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";
import ServiceCtaForm from "@/components/ServiceCtaForm";

export const revalidate = 60;

/* ── Types — mirror src/sanity/schemas/servicePage.ts ──────────────────── */
type ServiceImage = SanityImageSource & {
  alt?: string | null;
  caption?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

interface ServiceLanding {
  _id: string;
  title: string;
  slug: string | null;
  hero?: {
    headline?: string | null;
    subheadline?: string | null;
    image?: ServiceImage | null;
  } | null;
  howItWorks?: {
    title?: string | null;
    body?: PortableTextBlock[] | null;
  } | null;
  socialProof?: {
    title?: string | null;
    content?: PortableTextBlock[] | null;
  } | null;
  cta?: {
    headline?: string | null;
    description?: string | null;
    tallyUrl?: string | null;
  } | null;
  seo?: SeoSettings | null;
}

function hasAsset(img?: ServiceImage | null): img is ServiceImage {
  const asset = (img as { asset?: { _ref?: string; _id?: string } } | null)
    ?.asset;
  return !!(asset && (asset._ref || asset._id));
}

async function getService(slug: string): Promise<ServiceLanding | null> {
  return client.fetch(servicePageBySlugQuery, { slug });
}

/* Pre-render every authored landing page at build time. */
export async function generateStaticParams() {
  try {
    const rows =
      (await client.fetch<{ slug: string }[]>(servicePagesListQuery)) ?? [];
    return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return { title: "Not Found" };

  return buildMetadata({
    seo: service.seo,
    fallbackTitle: service.hero?.headline || service.title,
    fallbackDescription: service.hero?.subheadline,
    fallbackImage: service.hero?.image,
    url: `/services/${service.slug}`,
    type: "article",
  });
}

/* ── Rich-text components ──────────────────────────────────────────────── */
const richTextComponents: PortableTextComponents = {
  types: {
    /* Inline image inside the Social Proof canvas. */
    proofImage: ({ value }) => {
      const img = value as ServiceImage;
      if (!hasAsset(img)) return null;
      const dims = img.dimensions;
      const width = 1400;
      const height = dims ? Math.round(width / dims.aspectRatio) : 900;
      return (
        <figure className="my-10 md:my-14">
          <Image
            src={urlFor(img).width(width).quality(90).auto("format").url()}
            alt={img.alt || img.caption || ""}
            width={width}
            height={height}
            sizes="(max-width: 896px) 100vw, 896px"
            className="w-full h-auto object-contain"
          />
          {img.caption && (
            <figcaption className="mt-3 font-body text-sm text-foreground/50 text-center">
              {img.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    /* Pull-quote / callout. */
    callout: ({ value }) => {
      const v = value as { text?: string; attribution?: string };
      if (!v?.text) return null;
      return (
        <blockquote className="my-10 md:my-14 border-l-2 border-primary/40 pl-6 md:pl-8">
          <p className="font-serif italic text-neutral-800/90 text-xl md:text-2xl font-light leading-relaxed">
            {v.text}
          </p>
          {v.attribution && (
            <cite className="mt-4 block font-label text-[10px] uppercase tracking-[0.25em] text-primary/60 not-italic">
              {v.attribution}
            </cite>
          )}
        </blockquote>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="font-body text-base md:text-lg leading-relaxed text-foreground/65 mb-5">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="font-headline text-2xl md:text-3xl text-foreground mt-10 mb-4">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-5 space-y-2 font-body text-base md:text-lg leading-relaxed text-foreground/65">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-5 space-y-2 font-body text-base md:text-lg leading-relaxed text-foreground/65">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-foreground/85">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const blank = (value as { blank?: boolean })?.blank;
      return (
        <a
          href={(value as { href?: string })?.href || "#"}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

/* ── 1 · Hero ──────────────────────────────────────────────────────────── */
function HeroSection({ hero }: { hero: ServiceLanding["hero"] }) {
  if (!hero || (!hero.headline && !hero.subheadline && !hasAsset(hero.image)))
    return null;
  return (
    <header className="max-w-5xl mx-auto px-6 md:px-8 text-center">
      {hero.headline && (
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-light text-foreground leading-[1.05]">
          {hero.headline}
        </h1>
      )}
      {hero.subheadline && (
        <p className="font-body text-lg md:text-xl leading-relaxed text-foreground/55 mt-6 max-w-2xl mx-auto whitespace-pre-line">
          {hero.subheadline}
        </p>
      )}
      {hasAsset(hero.image) && (
        <div className="mt-12 md:mt-16">
          <Image
            src={urlFor(hero.image)
              .width(2000)
              .quality(90)
              .auto("format")
              .url()}
            alt={hero.image.alt || hero.headline || ""}
            width={2000}
            height={
              hero.image.dimensions
                ? Math.round(2000 / hero.image.dimensions.aspectRatio)
                : 1100
            }
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </header>
  );
}

/* ── 2 · How It Works ──────────────────────────────────────────────────── */
function HowItWorksSection({
  data,
}: {
  data: ServiceLanding["howItWorks"];
}) {
  const hasBody = Array.isArray(data?.body) && data!.body!.length > 0;
  if (!data || (!data.title && !hasBody)) return null;
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-8 mt-24 md:mt-32">
      {data.title && (
        <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-10">
          {data.title}
        </h2>
      )}
      {hasBody && (
        <PortableText value={data.body!} components={richTextComponents} />
      )}
    </section>
  );
}

/* ── 3 · Social Proof & Credibility ────────────────────────────────────── */
function SocialProofSection({
  data,
}: {
  data: ServiceLanding["socialProof"];
}) {
  const hasContent = Array.isArray(data?.content) && data!.content!.length > 0;
  if (!data || (!data.title && !hasContent)) return null;
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-8 mt-24 md:mt-32">
      {data.title && (
        <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-10">
          {data.title}
        </h2>
      )}
      {hasContent && (
        <PortableText value={data.content!} components={richTextComponents} />
      )}
    </section>
  );
}

export default async function ServiceLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getService(params.slug);
  if (!service) notFound();

  return (
    <div className="min-h-screen bg-background pt-28 pb-0">
      <div className="px-6 md:px-8 max-w-7xl mx-auto">
        <Link
          href="/services"
          className="inline-flex items-center font-label text-[10px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground transition-colors"
        >
          ← Services
        </Link>
      </div>

      <div className="mt-12 md:mt-16">
        <HeroSection hero={service.hero} />
        <HowItWorksSection data={service.howItWorks} />
        <SocialProofSection data={service.socialProof} />
        <ServiceCtaForm
          headline={service.cta?.headline}
          description={service.cta?.description}
          tallyUrl={service.cta?.tallyUrl}
        />
      </div>
    </div>
  );
}

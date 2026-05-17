import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { heroSettingsQuery } from "@/sanity/queries";
import { urlFor, type SanityImageSource } from "@/sanity/image";

interface HeroLink {
  type?: "internal" | "external";
  internal?: string;
  external?: string;
}

interface HeroColumn {
  subtitle: string;
  title: string;
  image?: SanityImageSource;
  link?: HeroLink;
}

// Seed data used when Sanity has no SiteSettings document yet
const seedColumns: {
  subtitle: string;
  title: string;
  link: HeroLink;
  staticSrc: string;
  alt: string;
}[] = [
  {
    subtitle: "Maestro",
    title: "Conductor",
    link: { type: "internal", internal: "/about" },
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAV-NmQ2MfRbFFjWo01G5_2094a4dysLjHYIgAv3Krd0s4ZTHBwrlhAPYlIVba0T-hzDL6IKsvYpPCHlqidOXIcWlWzE_xrV1B7YkEMhPtyG4jOOpVZKDcf6sVTBSsVB0nTL_xS_0Pl-6XMXuXd0YMkfDD7taGpyjl9ShkwHNuVfqTI_s3xZDsv-3e7KQX5HET9HJE87JqV392XliShTcUTC9S_i7ATOGAyYW9_Lb1sSxSFzzU7r0OEk6z6ivzyX02Jv48wst-9P7U",
    alt: "Dramatic portrait of a symphony conductor",
  },
  {
    subtitle: "Creator",
    title: "Composer",
    link: { type: "internal", internal: "/media/discography" },
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBezL1hNpPExeneC53GAH2ui7zGWIvGICC5xICTBUMjSJNXKKl0uPnqEbKkZU1UJFM--_KF8d4wso313gBPmMxPKqscMID-n6hLDcwwv6E65CkMNhw_BPJI6orGOBKKkS6nMnyKnCfkJmZUTMYZwYxGejTo-TnaCEV0QqkTdze5ypKuhftkUfocOYIe2Y64HrZTgmAQaEOPb-bF4CXd1EvUJMp7BggaOCDRZc-h_sq2sFKLMG3S2G3wDNv8crUgY3vhsvygAQexC6I",
    alt: "Sheet music and piano desk",
  },
  {
    subtitle: "Virtuoso",
    title: "Guitarist",
    link: { type: "internal", internal: "/media/video" },
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHngzL3XRvwLGEq3kAA5M_ifSIrq51cHFfStHHjZhfsQqlaa8zqHuaGOfHL4CrVA5yWWCHAgi6QHyU4Z6F9gAxK7Y50MJyRxozrIXUKpjYskHboJKudNZexudXemgaxY8BbEAKIfCkZVqDjSGm_Z9t-rvC-5EZmJzGpM9WD-hwnG3VQZpWbcsHtWfNIxFiOcpDE2UvH3VZMnjb9mM_6i4_JRuf4F7FCyGqRVLG1Dh4E61lOxGgDs5b0St23WuOm9COjICQWN3eCKM",
    alt: "Close up of hands playing classical guitar",
  },
  {
    subtitle: "UNESCO Envoy",
    title: "Scholar",
    link: { type: "internal", internal: "/articles" },
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk-OdmolduAlsd69H6AUxodi5LAFdUWqVvgd5F9zcIzTBybFdtW7ihCAM_-EDKaBz0ZmrmEtY6sHWeEmBwlYhdLNoWxl4dyEJhZ2rDCTF90fi5YUomNszfRv_UgPXDcX0Bdcn5Bj8vm8yUadzNVSJtudcZFadwvr6WBdaAtUo5_bY9sdbI8Hj6dOoA9orzrXqjteSjko-mOTa1vaIqymhp_LQVqtSStpw1ZCaC0LP0W4h5WiMY2Hs53Zfw3sqRlQ4ju6kk4srj5sc",
    alt: "Library with antique books",
  },
];

export const revalidate = 60;

/** Shared Ivory & Ebony tile — image, overlays, subtitle/title, hover arrow. */
function PanelInner({
  subtitle,
  title,
  imageNode,
}: {
  subtitle: string;
  title: string;
  imageNode: React.ReactNode;
}) {
  return (
    <>
      {imageNode}

      {/* Subtle Ebony→Transparent overlay (Palette #3) — keeps image colour intact while ensuring text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-[#1A1A1A]/15 to-transparent" />
      {/* Whisper-soft bronze tint to harmonise with the Ivory canvas */}
      <div className="absolute inset-0 bg-[#8C7851]/10 mix-blend-multiply pointer-events-none" />
      {/* Mobile-only contrast layer — guards white text against lighter image regions
          that may appear once the frame reshapes vertically on phones. Off from md+. */}
      <div className="absolute inset-0 bg-black/20 md:bg-transparent pointer-events-none" />

      {/* Text — vertically + horizontally centered on mobile, bottom-left from md+ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:items-start md:justify-end md:text-left md:px-14 md:pb-14">
        <p className="font-label text-[9px] uppercase tracking-[0.4em] text-background/60 md:text-background/40 mb-3 transition-colors duration-700 group-hover:text-background/80 md:group-hover:text-background/60">
          {subtitle}
        </p>
        <h2 className="font-serif-brand text-3xl sm:text-4xl md:text-4xl text-background font-light tracking-tight transition-transform duration-700 group-hover:translate-x-1">
          {title}
        </h2>
      </div>

      {/* Hover arrow — desktop-only (hover affordance not meaningful on touch) */}
      <span className="hidden md:inline absolute bottom-14 right-14 text-background/0 group-hover:text-background/40 transition-all duration-700 group-hover:translate-x-1 text-sm">
        →
      </span>
    </>
  );
}

const PANEL_CLASSES =
  "relative group flex-1 min-h-[280px] md:min-h-0 overflow-hidden transition-[flex] duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:flex-[2]";

/** Renders a hero panel using <Link> for internal routes or <a target="_blank"> for external. */
function HeroPanel({
  link,
  subtitle,
  title,
  imageNode,
  keyId,
}: {
  link: HeroLink | undefined;
  subtitle: string;
  title: string;
  imageNode: React.ReactNode;
  keyId: string;
}) {
  const isExternal = link?.type === "external" && !!link.external;
  const inner = (
    <PanelInner subtitle={subtitle} title={title} imageNode={imageNode} />
  );

  if (isExternal) {
    return (
      <a
        key={keyId}
        href={link!.external!}
        target="_blank"
        rel="noopener noreferrer"
        className={PANEL_CLASSES}
      >
        {inner}
      </a>
    );
  }

  const href = link?.internal || "/";
  return (
    <Link key={keyId} href={href} className={PANEL_CLASSES}>
      {inner}
    </Link>
  );
}

export default async function Hero() {
  let columns: HeroColumn[] = [];

  try {
    const settings = await client.fetch(heroSettingsQuery);
    if (settings?.heroColumns?.length) {
      columns = settings.heroColumns;
    }
  } catch {
    // Sanity unavailable — use seed data
  }

  const useSeed = columns.length === 0;

  return (
    <header className="pt-[72px] md:h-screen flex flex-col md:flex-row w-full overflow-hidden">
      {useSeed
        ? seedColumns.map((panel) => (
            <HeroPanel
              key={panel.title}
              keyId={panel.title}
              link={panel.link}
              subtitle={panel.subtitle}
              title={panel.title}
              imageNode={
                <Image
                  src={panel.staticSrc}
                  alt={panel.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority
                />
              }
            />
          ))
        : columns.map((col) => (
            <HeroPanel
              key={col.title}
              keyId={col.title}
              link={col.link}
              subtitle={col.subtitle}
              title={col.title}
              imageNode={
                col.image ? (
                  <Image
                    src={urlFor(col.image)
                      .width(1200)
                      .height(1600)
                      .fit("crop")
                      .crop("focalpoint")
                      .auto("format")
                      .url()}
                    alt={col.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                    priority
                  />
                ) : null
              }
            />
          ))}
    </header>
  );
}

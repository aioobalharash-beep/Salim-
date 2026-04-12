import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { heroSettingsQuery } from "@/sanity/queries";
import { urlFor, type SanityImageSource } from "@/sanity/image";

interface HeroColumn {
  subtitle: string;
  title: string;
  image?: SanityImageSource;
  link?: string;
}

// Seed data used when Sanity has no SiteSettings document yet
const seedColumns = [
  {
    subtitle: "Maestro",
    title: "Conductor",
    link: "/about",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAV-NmQ2MfRbFFjWo01G5_2094a4dysLjHYIgAv3Krd0s4ZTHBwrlhAPYlIVba0T-hzDL6IKsvYpPCHlqidOXIcWlWzE_xrV1B7YkEMhPtyG4jOOpVZKDcf6sVTBSsVB0nTL_xS_0Pl-6XMXuXd0YMkfDD7taGpyjl9ShkwHNuVfqTI_s3xZDsv-3e7KQX5HET9HJE87JqV392XliShTcUTC9S_i7ATOGAyYW9_Lb1sSxSFzzU7r0OEk6z6ivzyX02Jv48wst-9P7U",
    alt: "Dramatic portrait of a symphony conductor",
  },
  {
    subtitle: "Creator",
    title: "Composer",
    link: "/media/audio",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBezL1hNpPExeneC53GAH2ui7zGWIvGICC5xICTBUMjSJNXKKl0uPnqEbKkZU1UJFM--_KF8d4wso313gBPmMxPKqscMID-n6hLDcwwv6E65CkMNhw_BPJI6orGOBKKkS6nMnyKnCfkJmZUTMYZwYxGejTo-TnaCEV0QqkTdze5ypKuhftkUfocOYIe2Y64HrZTgmAQaEOPb-bF4CXd1EvUJMp7BggaOCDRZc-h_sq2sFKLMG3S2G3wDNv8crUgY3vhsvygAQexC6I",
    alt: "Sheet music and piano desk",
  },
  {
    subtitle: "Virtuoso",
    title: "Guitarist",
    link: "/media/video",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHngzL3XRvwLGEq3kAA5M_ifSIrq51cHFfStHHjZhfsQqlaa8zqHuaGOfHL4CrVA5yWWCHAgi6QHyU4Z6F9gAxK7Y50MJyRxozrIXUKpjYskHboJKudNZexudXemgaxY8BbEAKIfCkZVqDjSGm_Z9t-rvC-5EZmJzGpM9WD-hwnG3VQZpWbcsHtWfNIxFiOcpDE2UvH3VZMnjb9mM_6i4_JRuf4F7FCyGqRVLG1Dh4E61lOxGgDs5b0St23WuOm9COjICQWN3eCKM",
    alt: "Close up of hands playing classical guitar",
  },
  {
    subtitle: "UNESCO Envoy",
    title: "Scholar",
    link: "/journal",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk-OdmolduAlsd69H6AUxodi5LAFdUWqVvgd5F9zcIzTBybFdtW7ihCAM_-EDKaBz0ZmrmEtY6sHWeEmBwlYhdLNoWxl4dyEJhZ2rDCTF90fi5YUomNszfRv_UgPXDcX0Bdcn5Bj8vm8yUadzNVSJtudcZFadwvr6WBdaAtUo5_bY9sdbI8Hj6dOoA9orzrXqjteSjko-mOTa1vaIqymhp_LQVqtSStpw1ZCaC0LP0W4h5WiMY2Hs53Zfw3sqRlQ4ju6kk4srj5sc",
    alt: "Library with antique books",
  },
];

export const revalidate = 60;

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
    <header className="pt-[72px] h-screen flex flex-col md:flex-row w-full overflow-hidden">
      {useSeed
        ? seedColumns.map((panel) => (
            <Link
              key={panel.title}
              href={panel.link}
              className="relative group flex-1 min-h-[25vh] md:min-h-0 overflow-hidden transition-[flex] duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:flex-[2]"
            >
              <Image
                src={panel.staticSrc}
                alt={panel.alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-all duration-1000 ease-out group-hover:scale-105 brightness-[0.35] group-hover:brightness-[0.45]"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Text — pinned to bottom */}
              <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14">
                <p className="font-label text-[9px] uppercase tracking-[0.4em] text-[#F5F5F0]/40 mb-3 transition-colors duration-700 group-hover:text-[#F5F5F0]/60">
                  {panel.subtitle}
                </p>
                <h2 className="font-serif-brand text-3xl md:text-4xl text-[#F5F5F0] font-light tracking-tight transition-transform duration-700 group-hover:translate-x-1">
                  {panel.title}
                </h2>
              </div>

              {/* Hover arrow */}
              <span className="absolute bottom-10 right-10 md:bottom-14 md:right-14 text-[#F5F5F0]/0 group-hover:text-[#F5F5F0]/40 transition-all duration-700 group-hover:translate-x-1 text-sm">
                →
              </span>
            </Link>
          ))
        : columns.map((col) => (
            <Link
              key={col.title}
              href={col.link || "/"}
              className="relative group flex-1 min-h-[25vh] md:min-h-0 overflow-hidden transition-[flex] duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:flex-[2]"
            >
              {col.image && (
                <Image
                  src={urlFor(col.image).width(1200).height(1600).url()}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-all duration-1000 ease-out group-hover:scale-105 brightness-[0.35] group-hover:brightness-[0.45]"
                  priority
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Text — pinned to bottom */}
              <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14">
                <p className="font-label text-[9px] uppercase tracking-[0.4em] text-[#F5F5F0]/40 mb-3 transition-colors duration-700 group-hover:text-[#F5F5F0]/60">
                  {col.subtitle}
                </p>
                <h2 className="font-serif-brand text-3xl md:text-4xl text-[#F5F5F0] font-light tracking-tight transition-transform duration-700 group-hover:translate-x-1">
                  {col.title}
                </h2>
              </div>

              {/* Hover arrow */}
              <span className="absolute bottom-10 right-10 md:bottom-14 md:right-14 text-[#F5F5F0]/0 group-hover:text-[#F5F5F0]/40 transition-all duration-700 group-hover:translate-x-1 text-sm">
                →
              </span>
            </Link>
          ))}
    </header>
  );
}

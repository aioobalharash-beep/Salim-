import Image from "next/image";
import { client } from "@/sanity/client";
import { heroSettingsQuery } from "@/sanity/queries";
import { urlFor, type SanityImageSource } from "@/sanity/image";

interface HeroColumn {
  subtitle: string;
  title: string;
  image?: SanityImageSource;
}

// Seed data used when Sanity has no SiteSettings document yet
const seedColumns = [
  {
    subtitle: "Maestro",
    title: "Conductor",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAV-NmQ2MfRbFFjWo01G5_2094a4dysLjHYIgAv3Krd0s4ZTHBwrlhAPYlIVba0T-hzDL6IKsvYpPCHlqidOXIcWlWzE_xrV1B7YkEMhPtyG4jOOpVZKDcf6sVTBSsVB0nTL_xS_0Pl-6XMXuXd0YMkfDD7taGpyjl9ShkwHNuVfqTI_s3xZDsv-3e7KQX5HET9HJE87JqV392XliShTcUTC9S_i7ATOGAyYW9_Lb1sSxSFzzU7r0OEk6z6ivzyX02Jv48wst-9P7U",
    alt: "Dramatic portrait of a symphony conductor",
  },
  {
    subtitle: "Creator",
    title: "Composer",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBezL1hNpPExeneC53GAH2ui7zGWIvGICC5xICTBUMjSJNXKKl0uPnqEbKkZU1UJFM--_KF8d4wso313gBPmMxPKqscMID-n6hLDcwwv6E65CkMNhw_BPJI6orGOBKKkS6nMnyKnCfkJmZUTMYZwYxGejTo-TnaCEV0QqkTdze5ypKuhftkUfocOYIe2Y64HrZTgmAQaEOPb-bF4CXd1EvUJMp7BggaOCDRZc-h_sq2sFKLMG3S2G3wDNv8crUgY3vhsvygAQexC6I",
    alt: "Sheet music and piano desk",
  },
  {
    subtitle: "Virtuoso",
    title: "Guitarist",
    staticSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHngzL3XRvwLGEq3kAA5M_ifSIrq51cHFfStHHjZhfsQqlaa8zqHuaGOfHL4CrVA5yWWCHAgi6QHyU4Z6F9gAxK7Y50MJyRxozrIXUKpjYskHboJKudNZexudXemgaxY8BbEAKIfCkZVqDjSGm_Z9t-rvC-5EZmJzGpM9WD-hwnG3VQZpWbcsHtWfNIxFiOcpDE2UvH3VZMnjb9mM_6i4_JRuf4F7FCyGqRVLG1Dh4E61lOxGgDs5b0St23WuOm9COjICQWN3eCKM",
    alt: "Close up of hands playing classical guitar",
  },
  {
    subtitle: "UNESCO Envoy",
    title: "Scholar",
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

  // Fall back to seed if Sanity returns nothing
  const useSeed = columns.length === 0;

  return (
    <header className="pt-24 min-h-screen flex flex-col md:flex-row w-full overflow-hidden">
      {useSeed
        ? seedColumns.map((panel) => (
            <div
              key={panel.title}
              className="relative group flex-1 min-h-[409px] md:min-h-0 overflow-hidden cursor-pointer transition-all duration-700 hover:flex-[1.5]"
            >
              <Image
                src={panel.staticSrc}
                alt={panel.alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-surface/60 mb-2">
                  {panel.subtitle}
                </p>
                <h2 className="font-serif-brand text-4xl text-surface font-light tracking-tight">
                  {panel.title}
                </h2>
              </div>
            </div>
          ))
        : columns.map((col) => (
            <div
              key={col.title}
              className="relative group flex-1 min-h-[409px] md:min-h-0 overflow-hidden cursor-pointer transition-all duration-700 hover:flex-[1.5]"
            >
              {col.image && (
                <Image
                  src={urlFor(col.image).width(800).height(1000).url()}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-surface/60 mb-2">
                  {col.subtitle}
                </p>
                <h2 className="font-serif-brand text-4xl text-surface font-light tracking-tight">
                  {col.title}
                </h2>
              </div>
            </div>
          ))}
    </header>
  );
}

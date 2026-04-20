"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/sanity/image";

interface PortfolioItem {
  _id: string;
  title: string;
  type: "work" | "event";
  image?: { asset: { _ref: string } };
  link?: string;
}

// Seed data
const seedItems: PortfolioItem[] = [
  {
    _id: "seed-1",
    title: "The Mediterranean Symphony Cycle",
    type: "work",
    link: "/media",
  },
  {
    _id: "seed-2",
    title: "Echoes of Algiers",
    type: "work",
    link: "/media/discography",
  },
  {
    _id: "seed-3",
    title: "UNESCO Heritage Gala 2024",
    type: "event",
    link: "/about",
  },
  {
    _id: "seed-4",
    title: "Paris Conservatoire Masterclass",
    type: "event",
    link: "/training",
  },
];

const seedImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCm8N-B8paqMsf-Qq--j02S8rM6pwRW5iYqhHbHQ3hj2godwwe3TKmYIsI7ej8NDw2AjUkqulg6_K2Q1hT1gSowt7saduB_gri2VVFY2gxrzqFoNt8s-dBXbPGE_N4z-KP3YAj6Fry0EDBpuzfDswB5IOIUFV9UORspEBbQ2RygTCs6h09hJn2y6IMwdj7PtZHsrjB-Qzkf5sH21qoeJbvm-WyKQ0inrbQeiEBuZAaVPlzzgWlS3oK86Y0f1SsEt64H_U4O2HbaH7Q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQncCtMO1LDFajAnhmh05zwIo_IQRwymL9y2EG3ceqtszirfBoTL70nYvS4bLIgIv_iONQu42Df7ta_GKfzf6T7l_lBBDOXEBsFXs5GMB6oSPVe7O433s8_gpm-LXrqwPK4FZW6yEK0rDPZ_EvlOZfSof6F5ozP2PJz20Qqv0tDNn_5VDCOJBBu3q5h6snC2z7Qcirlb61C7k1undiDIlwmVNMBDTN8ZkzBbGob-_MapKkypGt2t025qAPtNDusV1A4rZV9AJR3Y",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2HzKVHVrZU6DMo9jGpg-hq9CrPTt2yR8306t0OXm2yM4T0dfOEedW2PPtbVEbZQLWxTWzziuGZ3jEzJsdT2NKBpfojGCzWJAyQ0s1b0_qdaB8wZxUUuxnVKNKP0MBKG5llqth2Ix3LWgkhT678AcgeGwhV_jikD4zMUmk3N1bQJZ_3How9am7KuP0OOKyOF4zNMNWUILr0xgwyBnra0d0arAmkFr0dRNos-rDU28KERJlBmB7rW-T4yl5Z38Gznb-0U53hioNps",
];

export default function PortfolioSlider({
  items,
}: {
  items: PortfolioItem[];
}) {
  const all = items.length > 0 ? items : seedItems;
  const useSeed = items.length === 0;

  const [activeTab, setActiveTab] = useState<"work" | "event">("work");
  const filtered = all.filter((i) => i.type === activeTab);
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPage = Math.max(0, Math.ceil(filtered.length / 2) - 1);
  const visiblePage = Math.min(page, maxPage);
  const visible = filtered.slice(visiblePage * 2, visiblePage * 2 + 2);

  const handleTabChange = (tab: "work" | "event") => {
    setActiveTab(tab);
    setPage(0);
  };

  function getImageSrc(item: PortfolioItem, index: number) {
    if (useSeed) {
      const seedIdx = seedItems.indexOf(item);
      return seedImages[seedIdx >= 0 ? seedIdx : index] || seedImages[0];
    }
    if (item.image) return urlFor(item.image).width(900).height(600).url();
    return seedImages[index % seedImages.length];
  }

  return (
    <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
      {/* Header with tabs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
        <div>
          <h3 className="font-headline text-3xl font-light mb-4">
            Work &amp; Events
          </h3>
          <div className="w-16 h-[1px] bg-primary/30" />
        </div>
        <div className="flex gap-8 mt-6 md:mt-0">
          {(["work", "event"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`font-label text-[11px] uppercase tracking-[0.2em] pb-2 border-b transition-all duration-300 ${
                activeTab === tab
                  ? "text-on-surface border-on-surface"
                  : "text-on-surface/30 border-transparent hover:text-on-surface/60"
              }`}
            >
              {tab === "work" ? "Latest Work" : "Upcoming Events"}
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div ref={containerRef} className="relative group/slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${visiblePage}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {visible.map((item, i) => {
              const Wrapper = item.link ? "a" : "div";
              const wrapperProps = item.link
                ? { href: item.link, target: item.link.startsWith("http") ? "_blank" as const : undefined, rel: item.link.startsWith("http") ? "noopener noreferrer" : undefined }
                : {};
              return (
                <Wrapper
                  key={item._id}
                  {...wrapperProps}
                  className="block group cursor-pointer"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden relative bg-surface-container-low">
                    <Image
                      src={getImageSrc(item, i)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale brightness-90 transition-all duration-700 group-hover:brightness-100 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h4 className="font-serif-brand text-xl mt-5 text-on-surface group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h4>
                </Wrapper>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Hidden arrows — appear on hover */}
        {filtered.length > 2 && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={visiblePage === 0}
            >
              <span className="text-on-surface text-sm">←</span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center bg-surface/90 shadow-card border border-outline-variant/10"
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={visiblePage >= maxPage}
            >
              <span className="text-on-surface text-sm">→</span>
            </motion.button>
          </>
        )}
      </div>
    </section>
  );
}

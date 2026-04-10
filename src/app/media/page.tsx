import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Media — Salim Dada",
  description:
    "Performances, interviews, press coverage, and archival recordings of Salim Dada.",
};

const mediaItems = [
  {
    type: "Performance",
    title: "Algiers International Festival — Opening Night",
    date: "November 2024",
    description:
      "A full orchestral premiere of the Mediterranean Symphony Cycle, performed under the stars at the Palais de la Culture.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQncCtMO1LDFajAnhmh05zwIo_IQRwymL9y2EG3ceqtszirfBoTL70nYvS4bLIgIv_iONQu42Df7ta_GKfzf6T7l_lBBDOXEBsFXs5GMB6oSPVe7O433s8_gpm-LXrqwPK4FZW6yEK0rDPZ_EvlOZfSof6F5ozP2PJz20Qqv0tDNn_5VDCOJBBu3q5h6snC2z7Qcirlb61C7k1undiDIlwmVNMBDTN8ZkzBbGob-_MapKkypGt2t025qAPtNDusV1A4rZV9AJR3Y",
    alt: "Night view of a classical outdoor theatre with spotlights",
    span: "md:col-span-2",
    aspect: "aspect-[21/9]",
  },
  {
    type: "Interview",
    title: "France Culture — The Art of Silence",
    date: "September 2024",
    description:
      "A long-form radio interview exploring the philosophy of negative space in composition and conducting.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm8N-B8paqMsf-Qq--j02S8rM6pwRW5iYqhHbHQ3hj2godwwe3TKmYIsI7ej8NDw2AjUkqulg6_K2Q1hT1gSowt7saduB_gri2VVFY2gxrzqFoNt8s-dBXbPGE_N4z-KP3YAj6Fry0EDBpuzfDswB5IOIUFV9UORspEBbQ2RygTCs6h09hJn2y6IMwdj7PtZHsrjB-Qzkf5sH21qoeJbvm-WyKQ0inrbQeiEBuZAaVPlzzgWlS3oK86Y0f1SsEt64H_U4O2HbaH7Q",
    alt: "Microphone in a dark studio setting",
    span: "md:col-span-1",
    aspect: "aspect-square",
  },
  {
    type: "Press",
    title: "Le Monde — The Bridge Between Two Shores",
    date: "June 2024",
    description:
      "A profile piece on Salim Dada's role as a cultural ambassador, bridging Algerian and French musical institutions.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2HzKVHVrZU6DMo9jGpg-hq9CrPTt2yR8306t0OXm2yM4T0dfOEedW2PPtbVEbZQLWxTWzziuGZ3jEzJsdT2NKBpfojGCzWJAyQ0s1b0_qdaB8wZxUUuxnVKNKP0MBKG5llqth2Ix3LWgkhT678AcgeGwhV_jikD4zMUmk3N1bQJZ_3How9am7KuP0OOKyOF4zNMNWUILr0xgwyBnra0d0arAmkFr0dRNos-rDU28KERJlBmB7rW-T4yl5Z38Gznb-0U53hioNps",
    alt: "Ancient manuscript with handwritten notations",
    span: "md:col-span-1",
    aspect: "aspect-[4/3]",
  },
  {
    type: "Archival",
    title: "UNESCO Heritage Recording Sessions",
    date: "March 2024",
    description:
      "Behind-the-scenes documentation of field recording sessions preserving endangered musical traditions across the Maghreb.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI",
    alt: "Concert hall with warm wooden architecture",
    span: "md:col-span-2",
    aspect: "aspect-video",
  },
];

export default function MediaPage() {
  return (
    <>
      <PageHeader
        tag="Archive"
        title="Media"
        description="Performances, interviews, press coverage, and archival recordings — a living document of artistic practice."
      />

      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mediaItems.map((item) => (
            <div
              key={item.title}
              className={`${item.span} bg-surface-container-low rounded shadow-card overflow-hidden group cursor-pointer`}
            >
              <div className={`${item.aspect} w-full overflow-hidden relative`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover grayscale brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-label text-[10px] uppercase tracking-widest text-surface/60 mb-2">
                    {item.type} &middot; {item.date}
                  </p>
                  <h4 className="font-serif-brand text-xl text-surface">
                    {item.title}
                  </h4>
                </div>
              </div>
              <div className="p-6">
                <p className="font-body text-xs leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Shop — Salim Dada",
  description:
    "Recordings, scores, and publications by Salim Dada available for purchase.",
};

const products = [
  {
    title: "Echoes of Algiers",
    category: "Album",
    price: "$18.00",
    description:
      "Solo guitar compositions recorded in the silence of the Casbah, utilizing natural room acoustics.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm8N-B8paqMsf-Qq--j02S8rM6pwRW5iYqhHbHQ3hj2godwwe3TKmYIsI7ej8NDw2AjUkqulg6_K2Q1hT1gSowt7saduB_gri2VVFY2gxrzqFoNt8s-dBXbPGE_N4z-KP3YAj6Fry0EDBpuzfDswB5IOIUFV9UORspEBbQ2RygTCs6h09hJn2y6IMwdj7PtZHsrjB-Qzkf5sH21qoeJbvm-WyKQ0inrbQeiEBuZAaVPlzzgWlS3oK86Y0f1SsEt64H_U4O2HbaH7Q",
    alt: "Microphone close up in a dark studio setting",
  },
  {
    title: "The Mediterranean Symphony Cycle",
    category: "Score",
    price: "$45.00",
    description:
      "Full orchestral score for the UNESCO-commissioned multi-movement work exploring shared Mediterranean sonic heritage.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2HzKVHVrZU6DMo9jGpg-hq9CrPTt2yR8306t0OXm2yM4T0dfOEedW2PPtbVEbZQLWxTWzziuGZ3jEzJsdT2NKBpfojGCzWJAyQ0s1b0_qdaB8wZxUUuxnVKNKP0MBKG5llqth2Ix3LWgkhT678AcgeGwhV_jikD4zMUmk3N1bQJZ_3How9am7KuP0OOKyOF4zNMNWUILr0xgwyBnra0d0arAmkFr0dRNos-rDU28KERJlBmB7rW-T4yl5Z38Gznb-0U53hioNps",
    alt: "Ancient musical manuscript with handwritten notations",
  },
  {
    title: "The Trans-Saharan Scale",
    category: "Publication",
    price: "$32.00",
    description:
      "An archival study on the migration of microtonal melodies from the Sahel to the Mediterranean coast.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQncCtMO1LDFajAnhmh05zwIo_IQRwymL9y2EG3ceqtszirfBoTL70nYvS4bLIgIv_iONQu42Df7ta_GKfzf6T7l_lBBDOXEBsFXs5GMB6oSPVe7O433s8_gpm-LXrqwPK4FZW6yEK0rDPZ_EvlOZfSof6F5ozP2PJz20Qqv0tDNn_5VDCOJBBu3q5h6snC2z7Qcirlb61C7k1undiDIlwmVNMBDTN8ZkzBbGob-_MapKkypGt2t025qAPtNDusV1A4rZV9AJR3Y",
    alt: "Classical outdoor theatre with spotlights at night",
  },
];

export default function ShopPage() {
  return (
    <>
      <PageHeader
        tag="Collection"
        title="Shop"
        description="Recordings, full orchestral scores, and academic publications — each work a document of Mediterranean musical heritage."
      />

      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.title}
              className="bg-surface-container-low rounded shadow-card overflow-hidden group"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale brightness-95 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-label text-[10px] uppercase tracking-widest text-primary">
                    {product.category}
                  </p>
                  <p className="font-label text-sm text-on-surface">
                    {product.price}
                  </p>
                </div>
                <h4 className="font-serif-brand text-xl mb-3">
                  {product.title}
                </h4>
                <p className="font-body text-xs leading-relaxed text-on-surface-variant mb-6">
                  {product.description}
                </p>
                <button className="w-full py-3 bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
                  Add to Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

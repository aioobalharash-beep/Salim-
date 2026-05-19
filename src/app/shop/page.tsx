import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShopCarousel, { type ShopSlide } from "@/components/ShopCarousel";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { shopListQuery } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop — Salim Dada",
  description:
    "Scores, tabs, and books by Salim Dada — available through Sonitus Edizioni and partner publishers.",
};

type ShopImage = SanityImageSource & { alt?: string };

type ShopItem = {
  _id: string;
  title: string;
  priceText: string;
  description?: string;
  purchaseUrl: string;
  images?: ShopImage[];
};

async function getShopItems(): Promise<ShopItem[]> {
  try {
    return (await client.fetch<ShopItem[]>(shopListQuery)) ?? [];
  } catch {
    return [];
  }
}

function buildSlides(item: ShopItem): ShopSlide[] {
  const images = item.images ?? [];
  return images
    .map((img) => {
      try {
        return {
          url: urlFor(img).width(800).height(1200).fit("crop").url(),
          alt: img.alt || item.title,
        };
      } catch {
        return null;
      }
    })
    .filter((s): s is ShopSlide => s !== null);
}

export default async function ShopPage() {
  const items = await getShopItems();

  return (
    <>
      <PageHeader
        tag="Collection"
        title="Shop"
        description="Scores, tabs, and books — published works available for purchase through Sonitus Edizioni and partner editions."
      />

      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        {items.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant max-w-xl">
            New publications are being prepared. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center md:justify-items-stretch">
            {items.map((item) => {
              const slides = buildSlides(item);
              const snippet =
                item.description && item.description.length > 160
                  ? `${item.description.slice(0, 157).trimEnd()}…`
                  : item.description;

              return (
                <article
                  key={item._id}
                  className="w-full max-w-sm md:max-w-none flex flex-col"
                >
                  <div className="relative w-full aspect-[2/3] overflow-hidden bg-surface-container">
                    <ShopCarousel slides={slides} title={item.title} />
                  </div>

                  <div className="pt-6 flex flex-col">
                    <h2 className="font-serif-brand text-xl text-on-surface mb-2 leading-snug">
                      {item.title}
                    </h2>

                    <p className="font-label text-2xl font-semibold text-on-surface mb-4 tracking-tight">
                      €{item.priceText}
                    </p>

                    {snippet ? (
                      <p className="font-body text-xs leading-relaxed text-on-surface-variant mb-6">
                        {snippet}
                      </p>
                    ) : null}

                    <a
                      href={item.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center w-full py-3 border border-on-surface/20 text-on-surface font-label text-[10px] lowercase tracking-widest hover:bg-on-surface hover:text-background transition-colors"
                    >
                      purchase asset
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { shopListQuery } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop — Salim Dada",
  description:
    "Scores, tabs, and books by Salim Dada — available through Sonitus Edizioni and partner publishers.",
};

type ShopItem = {
  _id: string;
  title: string;
  category?: "Scores" | "Tabs" | "Books" | "Other";
  priceText?: string;
  description?: string;
  purchaseUrl: string;
  coverImage?: SanityImageSource & { alt?: string };
};

async function getShopItems(): Promise<ShopItem[]> {
  try {
    return (await client.fetch<ShopItem[]>(shopListQuery)) ?? [];
  } catch {
    return [];
  }
}

function ctaLabelFor(category?: ShopItem["category"]) {
  if (category === "Scores" || category === "Tabs") return "buy score";
  return "purchase asset";
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
            {items.map((item) => {
              const imgUrl = item.coverImage
                ? urlFor(item.coverImage).width(900).height(675).fit("crop").url()
                : null;
              const altText = item.coverImage?.alt || item.title;
              const snippet =
                item.description && item.description.length > 160
                  ? `${item.description.slice(0, 157).trimEnd()}…`
                  : item.description;

              return (
                <article
                  key={item._id}
                  className="w-full max-w-sm md:max-w-none bg-surface-container-low rounded shadow-card overflow-hidden flex flex-col group"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-surface-container">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      {item.category ? (
                        <p className="font-label text-[10px] uppercase tracking-widest text-primary">
                          {item.category}
                        </p>
                      ) : (
                        <span />
                      )}
                      {item.priceText ? (
                        <p className="font-label text-sm text-on-surface">
                          {item.priceText}
                        </p>
                      ) : null}
                    </div>

                    <h2 className="font-serif-brand text-xl text-on-surface mb-3">
                      {item.title}
                    </h2>

                    {snippet ? (
                      <p className="font-body text-xs leading-relaxed text-on-surface-variant mb-6">
                        {snippet}
                      </p>
                    ) : null}

                    <a
                      href={item.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center w-full py-3 border border-on-surface/20 text-on-surface font-label text-[10px] uppercase tracking-widest rounded-sm hover:bg-on-surface hover:text-background transition-colors"
                    >
                      {ctaLabelFor(item.category)}
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

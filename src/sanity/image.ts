import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

// Source type from Sanity image fields
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

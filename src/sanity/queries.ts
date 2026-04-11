import { groq } from "next-sanity";

export const journalListQuery = groq`
  *[_type == "journal"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    featuredImage
  }
`;

export const journalBySlugQuery = groq`
  *[_type == "journal" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    featuredImage,
    body
  }
`;

export const heroSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroColumns[] {
      subtitle,
      title,
      image
    }
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    profileImage,
    bio,
    mainBio,
    shortIntro,
    pullQuote,
    achievements,
    philosophy
  }
`;

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
      image,
      link
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
    chronology[] {
      year,
      title,
      description
    }
  }
`;

export const portfolioQuery = groq`
  *[_type == "portfolio"] | order(order asc) {
    _id,
    title,
    type,
    image,
    link
  }
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    icon,
    description,
    duration,
    ctaLabel,
    ctaLink,
    action
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    content
  }
`;

export const audioListQuery = groq`
  *[_type == "audio"] | order(publishDate desc) {
    _id,
    title,
    releaseType,
    artist,
    instrumentation,
    label,
    country,
    albumCover,
    "audioUrl": audioFile.asset->url,
    tracks[]{
      _key,
      title,
      "audioUrl": audioFile.asset->url
    },
    purchaseUrl,
    shareUrl,
    publishDate
  }
`;

export const discographyListQuery = audioListQuery;

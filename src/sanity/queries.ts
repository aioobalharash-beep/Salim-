import { groq } from "next-sanity";

export const articlesListQuery = groq`
  *[_type == "articles"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    featuredImage
  }
`;

export const articlesBySlugQuery = groq`
  *[_type == "articles" && slug.current == $slug][0] {
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
    imageCaption,
    heroTitle,
    heroSubtitle,
    bioTitle,
    bio,
    mainBio,
    shortIntro,
    pullQuote,
    timelineTitle,
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
    album,
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
    watchUrl,
    publishDate
  }
`;

export const discographyListQuery = audioListQuery;

export const galleryListQuery = groq`
  *[_type == "gallery" && defined(image)] {
    _id,
    image,
    description,
    ratio
  }
`;

export const reviewsListQuery = groq`
  *[_type == "reviews"] | order(year desc) {
    _id,
    content,
    translation,
    sourceText,
    place,
    year
  }
`;

export const catalogueListQuery = groq`
  *[_type == "catalogue" && published == true] | order(year desc, title asc) {
    _id,
    title,
    subtitle,
    description,
    year,
    instrumentation,
    genre,
    durationMinutes,
    durationDisplay,
    movements,
    published,
    premiereDate,
    premierePlace,
    performers,
    watchLink,
    "audioUrl": audioFile.asset->url
  }
`;

export const videoListQuery = groq`
  *[_type == "video"] | order(order asc, _createdAt desc) {
    _id,
    videoLink,
    description
  }
`;

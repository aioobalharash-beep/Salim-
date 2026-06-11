import { groq } from "next-sanity";

const seoProjection = groq`
  metaTitle,
  metaDescription,
  keywords,
  ogImage{
    ...,
    "alt": coalesce(alt, asset->altText, ""),
    "dimensions": asset->metadata.dimensions,
    asset
  }
`;

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
    richTitle,
    "slug": slug.current,
    category,
    eyebrowTags,
    publishedAt,
    readingTimeMinutes,
    byline,
    bylineDetails,
    deck,
    excerpt,
    showHeroOrnament,
    accentColor,
    showTableOfContents,
    featuredImage{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      caption,
      credit,
      "dimensions": asset->metadata.dimensions,
      asset
    },
    socialShareImage{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      "dimensions": asset->metadata.dimensions,
      asset
    },
    body[]{
      ...,
      _type == "bodyImage" => {
        ...,
        "alt": coalesce(alt, asset->altText, ""),
        "dimensions": asset->metadata.dimensions,
        asset
      }
    },
    seo{
      ${seoProjection}
    }
  }
`;

export const heroSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroColumns[] {
      subtitle,
      title,
      image{
        ...,
        hotspot,
        crop,
        asset
      },
      link{
        type,
        internal,
        external
      }
    }
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    profileImage{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      asset
    },
    imageCaption,
    heroTitle,
    heroSubtitle,
    bioTitle,
    bio,
    mainBio,
    shortIntro,
    pullQuote,
    timelineTitle,
    seo{
      ${seoProjection}
    }
  }
`;

export const portfolioQuery = groq`
  *[_type == "portfolio"] | order(pageGroup asc, order asc) {
    _id,
    title,
    eyebrow,
    description,
    type,
    orientation,
    pageGroup,
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
  *[_type == "testimonial" && approved == true && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    name,
    profession,
    city,
    country,
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
  *[_type == "catalogue"] | order(year desc, title asc) {
    _id,
    title,
    subtitle,
    description,
    year,
    instrumentation,
    instrumentationDetail,
    genre,
    duration,
    movements,
    published,
    publicationUrl,
    premiereDate,
    premierePlace,
    performers,
    watchLink,
    "audioFileUrl": audioFile.asset->url,
    audioUrl,
    "slug": slug.current,
    seo{
      ${seoProjection}
    }
  }
`;

export const projectsListQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(coalesce(year, "") desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    year,
    coverImage{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      "dimensions": asset->metadata.dimensions,
      asset
    }
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    year,
    overview,
    coverImage{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      "dimensions": asset->metadata.dimensions,
      asset
    },
    heroImage{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      "dimensions": asset->metadata.dimensions,
      asset
    },
    gallery[]{
      _key,
      _type,
      _type == "galleryImage" => {
        ...,
        "alt": coalesce(alt, asset->altText, ""),
        title,
        description,
        "dimensions": asset->metadata.dimensions,
        asset
      },
      _type == "imageGroup" => {
        title,
        description,
        images[]{
          ...,
          "alt": coalesce(alt, asset->altText, ""),
          title,
          description,
          "dimensions": asset->metadata.dimensions,
          asset
        }
      },
      _type == "youtube" => {
        url,
        startTime,
        title,
        description
      },
      _type == "videoFile" => {
        title,
        description,
        "videoUrl": file.asset->url
      }
    },
    projectDetails[]{
      label,
      value
    },
    footerText,
    showContactBar,
    contactBarText,
    contactButtonLabel,
    seo{
      ${seoProjection}
    }
  }
`;

// Chronological order: OLDEST at the top → most RECENT at the bottom.
// `year` is a string ("1975", "2025-2026", "2026 - present"); because every
// value starts with its 4-digit start year, a lexicographic ascending sort
// resolves to true chronological order.
export const timelineQuery = groq`
  *[_type == "timeline" && defined(year)] | order(year asc) {
    _id,
    year,
    milestones[]{
      title,
      description,
      location
    }
  }
`;

export const legalQuery = groq`
  *[_type == "legal"][0] {
    title,
    content,
    seo{
      ${seoProjection}
    }
  }
`;

export const videoListQuery = groq`
  *[_type == "video"] | order(order asc, _createdAt desc) {
    _id,
    videoLink,
    description,
    startTime
  }
`;

export const shopListQuery = groq`
  *[_type == "shop"] | order(coalesce(year, 0) desc, coalesce(month, "00") desc, _createdAt desc) {
    _id,
    title,
    category,
    year,
    month,
    priceText,
    description,
    purchaseUrl,
    images[]{
      ...,
      "alt": coalesce(alt, asset->altText, ""),
      "dimensions": asset->metadata.dimensions,
      asset
    },
    additionalInfo[]{
      label,
      value
    },
    audioTracks[]{
      trackTitle,
      trackDescription,
      "audioUrl": audioFile.asset->url
    }
  }
`;

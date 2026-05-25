// Canonical list of the four B2B service offerings. The clicked card's title
// becomes the immutable email subject, so the server validates against this
// allowlist — a spoofed value can never reach Salim's inbox as a real segment.
export const SERVICE_ENQUIRY_TITLES = [
  "Music Composition",
  "Composer Program",
  "Artistic Direction",
  "Cultural Expertise",
] as const;

export type ServiceEnquiryTitle = (typeof SERVICE_ENQUIRY_TITLES)[number];

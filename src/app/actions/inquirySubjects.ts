export const INQUIRY_SUBJECTS = [
  "Music Composition",
  "Composer Program",
  "Musical or Artistic Direction",
  "Cultural Expertise or Musical Research",
  "Musician & Performances",
  "Other",
] as const;

export type InquirySubject = (typeof INQUIRY_SUBJECTS)[number];

export const INQUIRY_SUBJECTS = [
  "General Inquiry",
  "Composition & Commissioning",
  "Conducting & Masterclasses",
  "Academic Research",
  "Others",
] as const;

export type InquirySubject = (typeof INQUIRY_SUBJECTS)[number];

"use server";

import { Resend } from "resend";

const INQUIRY_SUBJECTS = [
  "General Inquiry",
  "Composition & Commissioning",
  "Conducting & Masterclasses",
  "Academic Research",
  "Others",
] as const;

export type InquirySubject = (typeof INQUIRY_SUBJECTS)[number];

export type InquiryResult = { ok: true } | { ok: false; error: string };

const RECIPIENT = "salimdadanet@gmail.com";
const FROM_ADDRESS =
  process.env.INQUIRY_FROM_EMAIL ?? "Salim Dada Website <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendInquiry(formData: FormData): Promise<InquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { ok: false, error: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  const allowedSubject = (INQUIRY_SUBJECTS as readonly string[]).includes(subject)
    ? (subject as InquirySubject)
    : "Others";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return { ok: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);
  const emailSubject = `[Website Inquiry: ${allowedSubject}] from ${name}`;

  const html = `
    <div style="font-family: Georgia, serif; color: #1A1A1A; background: #F4F1EA; padding: 32px;">
      <h2 style="font-weight: 300; letter-spacing: 0.05em; border-bottom: 1px solid #8C7851; padding-bottom: 12px;">
        New Website Inquiry
      </h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(allowedSubject)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; border-left: 2px solid #8C7851; padding-left: 16px;">${escapeHtml(message)}</p>
    </div>
  `;

  const text = [
    `New Website Inquiry`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${allowedSubject}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: RECIPIENT,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
    });

    if (error) {
      console.error("Resend send error:", error);
      return { ok: false, error: "Email delivery failed." };
    }

    return { ok: true };
  } catch (err) {
    console.error("Inquiry send exception:", err);
    return { ok: false, error: "Unexpected error sending inquiry." };
  }
}

export { INQUIRY_SUBJECTS };

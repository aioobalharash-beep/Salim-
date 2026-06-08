"use server";

import { Resend } from "resend";
import { INQUIRY_SUBJECTS, type InquirySubject } from "./inquirySubjects";
import { SERVICE_ENQUIRY_TITLES } from "./serviceEnquiries";

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
    : "Other";

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

// Project enquiries from an individual project page's contact bar. The
// subject is locked to the project the visitor is viewing — its title is
// dynamic (one per project), so unlike service enquiries it can't be matched
// against a fixed allowlist; we sanitise it and cap its length instead.
export async function sendProjectEnquiry(
  formData: FormData,
): Promise<InquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Collapse any newlines so the value can't smuggle extra email headers.
  const project = String(formData.get("project") ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 120);

  if (!name || !email || !project || !message) {
    return { ok: false, error: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return { ok: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);
  const emailSubject = `[Project Enquiry] - ${project}`;

  const html = `
    <div style="font-family: Georgia, serif; color: #1A1A1A; background: #F4F1EA; padding: 32px;">
      <h2 style="font-weight: 300; letter-spacing: 0.05em; border-bottom: 1px solid #8C7851; padding-bottom: 12px;">
        New Project Enquiry
      </h2>
      <p><strong>Project:</strong> ${escapeHtml(project)}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; border-left: 2px solid #8C7851; padding-left: 16px;">${escapeHtml(message)}</p>
    </div>
  `;

  const text = [
    `New Project Enquiry`,
    `Project: ${project}`,
    `Name: ${name}`,
    `Email: ${email}`,
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
    console.error("Project enquiry send exception:", err);
    return { ok: false, error: "Unexpected error sending enquiry." };
  }
}

// Service-card enquiries from the homepage Offering grid. Shares the same
// Resend pipeline as the contact form, but the subject is locked to the
// clicked service so Salim can instantly tell which segment a lead belongs to.
export async function sendServiceEnquiry(
  formData: FormData,
): Promise<InquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !service || !message) {
    return { ok: false, error: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  // The service name is an immutable subject set by which card was clicked —
  // reject anything outside the published offerings so it can't be spoofed.
  if (!(SERVICE_ENQUIRY_TITLES as readonly string[]).includes(service)) {
    return { ok: false, error: "Unknown service." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return { ok: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);
  const emailSubject = `[Service Enquiry] - ${service}`;

  const html = `
    <div style="font-family: Georgia, serif; color: #1A1A1A; background: #F4F1EA; padding: 32px;">
      <h2 style="font-weight: 300; letter-spacing: 0.05em; border-bottom: 1px solid #8C7851; padding-bottom: 12px;">
        New Service Enquiry
      </h2>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; border-left: 2px solid #8C7851; padding-left: 16px;">${escapeHtml(message)}</p>
    </div>
  `;

  const text = [
    `New Service Enquiry`,
    `Service: ${service}`,
    `Name: ${name}`,
    `Email: ${email}`,
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
    console.error("Service enquiry send exception:", err);
    return { ok: false, error: "Unexpected error sending enquiry." };
  }
}

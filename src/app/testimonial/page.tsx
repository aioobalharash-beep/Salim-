import type { Metadata } from "next";
import TestimonialForm from "@/components/TestimonialForm";

export const metadata: Metadata = {
  title: "Share Your Experience — Salim Dada",
  description:
    "Write a testimonial about your experience with the work of Salim Dada.",
};

export default function TestimonialPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-32 bg-surface-container-low">
      <div className="relative bg-surface w-full max-w-md p-10 md:p-12 shadow-card">
        <TestimonialForm />
      </div>
    </div>
  );
}

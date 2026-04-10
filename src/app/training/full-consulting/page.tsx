import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Full Consulting Engagement — Salim Dada",
  description:
    "Comprehensive artistic direction and consulting services by Salim Dada. Bespoke pricing and Stripe checkout coming soon.",
};

export default function FullConsultingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-32 px-6">
      <div className="max-w-lg text-center">
        <span className="material-symbols-outlined text-primary/30 text-5xl mb-8 block">
          workspace_premium
        </span>

        <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
          Premium Engagement
        </p>

        <h1 className="font-headline text-4xl md:text-5xl font-light mb-8 text-on-surface">
          Full Consulting
        </h1>

        <p className="font-body text-base leading-relaxed text-on-surface-variant mb-12 max-w-md mx-auto">
          Comprehensive artistic direction for international festivals, cultural
          institutions, and heritage preservation projects. Each engagement is
          bespoke, scoped to your specific artistic vision.
        </p>

        {/* Stripe-ready placeholder */}
        <div className="bg-surface-container-low border border-outline-variant/10 p-10 mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-xl">
              lock
            </span>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/60">
              Secure Payment — Coming Soon
            </p>
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
            Online booking with Stripe checkout is being configured.
            In the meantime, please submit an inquiry and our team will
            provide a detailed proposal within 72 hours.
          </p>
          <a
            href="/#enquiry-section"
            className="inline-block w-full py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity text-center"
          >
            Request Proposal
          </a>
        </div>

        <Link
          href="/training"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/50 hover:text-primary transition-colors"
        >
          &larr; All Programmes
        </Link>
      </div>
    </div>
  );
}

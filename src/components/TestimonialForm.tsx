"use client";

import { useState } from "react";

export default function TestimonialForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName || "Anonymous",
        email: "testimonial@submission",
        source: "testimonial",
      }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-tertiary text-4xl mb-6 block">
          check_circle
        </span>
        <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
          Thank You
        </h3>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
          Your testimonial has been submitted for review.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="font-label text-[10px] uppercase tracking-[0.2em] text-primary hover:text-on-surface transition-colors"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
        Share Your Experience
      </p>
      <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
        Write a Testimonial
      </h3>
      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10">
        Your words help others discover the value of this work. Thank you for sharing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
            Your Name (optional)
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Anonymous"
            className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
            Your Experience
          </label>
          <textarea
            required
            rows={4}
            value={formText}
            onChange={(e) => setFormText(e.target.value)}
            placeholder="Share your experience..."
            className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={!formText}
          className="w-full py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Submit
        </button>
      </form>
    </>
  );
}

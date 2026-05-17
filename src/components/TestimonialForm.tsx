"use client";

import { useState } from "react";

export default function TestimonialForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, profession, city, country, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
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
        Your words help others discover the value of this work. Submissions are
        reviewed before they appear on the site.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="Your Name"
          value={name}
          onChange={setName}
          required
          placeholder="Sergio Puccini"
        />
        <Field
          label="Profession"
          value={profession}
          onChange={setProfession}
          placeholder="Guitarist"
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="City"
            value={city}
            onChange={setCity}
            placeholder="Rosario"
          />
          <Field
            label="Country"
            value={country}
            onChange={setCountry}
            placeholder="Argentina"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
            Your Experience
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
            className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all resize-none"
          />
        </div>

        {error && (
          <p className="font-body text-xs text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={!name.trim() || !content.trim() || submitting}
          className="w-full py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
        {label}
        {!required && <span className="opacity-50"> (optional)</span>}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
      />
    </div>
  );
}

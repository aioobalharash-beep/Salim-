"use client";

import { useState } from "react";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ open, onClose }: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, source: "free-consulting" }),
    });

    setSending(false);
    setDone(true);
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-surface w-full max-w-md mx-6 p-10 md:p-12 shadow-card">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-on-surface-variant/40 hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {!done ? (
          <>
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
              Complimentary Session
            </p>
            <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
              15-Minute Consultation
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10">
              Reserve a complimentary introductory session to discuss your
              artistic needs. We will follow up within 48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={sending || !name || !email}
                className="w-full py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {sending ? "Reserving..." : "Reserve Session"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-tertiary text-4xl mb-6 block">
              check_circle
            </span>
            <h3 className="font-headline text-2xl font-light mb-3 text-on-surface">
              Session Reserved
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
              Thank you, {name}. We will reach out to {email} within 48 hours to
              confirm your complimentary consultation.
            </p>
            <button
              onClick={handleClose}
              className="font-label text-[10px] uppercase tracking-[0.2em] text-primary hover:text-on-surface transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

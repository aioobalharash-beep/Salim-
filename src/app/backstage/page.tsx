"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BackstageLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/backstage/dashboard");
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-16">
          <h1 className="font-serif-brand text-2xl tracking-widest uppercase text-on-surface mb-3">
            Salim Dada
          </h1>
          <div className="w-12 h-[1px] bg-primary/30 mx-auto mb-4" />
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/60">
            Backstage
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col space-y-3">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
              Access Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter administrative passphrase"
              className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-sm transition-colors placeholder:text-on-surface-variant/30"
              autoFocus
            />
            {error && (
              <p className="font-label text-[10px] uppercase tracking-widest text-error">
                Invalid access key. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-primary text-on-primary font-label text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Verifying..." : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center mt-16 font-body text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
          Authorised personnel only
        </p>
      </div>
    </div>
  );
}

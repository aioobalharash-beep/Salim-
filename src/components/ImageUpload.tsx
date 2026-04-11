"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  aspect = "aspect-video",
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      setProgress(0);

      // Simulate progress while waiting for response
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 90));
      }, 150);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(interval);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { url } = await res.json();
        setProgress(100);

        // Brief pause at 100% before completing
        setTimeout(() => {
          onChange(url);
          setUploading(false);
          setProgress(0);
        }, 400);
      } catch (err) {
        clearInterval(interval);
        setError(err instanceof Error ? err.message : "Upload failed");
        setUploading(false);
        setProgress(0);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [upload]
  );

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface/50">
        {label}
      </label>

      {/* Preview with current image */}
      {value && !uploading && (
        <div className={`relative ${aspect} w-full overflow-hidden bg-surface-container-low border border-outline-variant/10 mb-2`}>
          <Image
            src={value}
            alt="Current image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-3 right-3 px-4 py-2 bg-surface/90 backdrop-blur-sm border border-outline-variant/20 font-label text-[9px] uppercase tracking-widest text-on-surface hover:bg-surface transition-colors"
          >
            Replace
          </button>
        </div>
      )}

      {/* Dropzone */}
      {(!value || uploading) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`${aspect} w-full flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 cursor-pointer ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-outline-variant/20 hover:border-primary/40 bg-surface-container-low"
          } ${uploading ? "pointer-events-none" : ""}`}
        >
          {uploading ? (
            <div className="w-full px-12 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg animate-pulse">
                  cloud_upload
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest text-primary/60">
                  Uploading...
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-[2px] bg-outline-variant/10 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center font-label text-[9px] text-primary/40">
                {progress}%
              </p>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-primary/30 text-4xl mb-4">
                add_photo_alternate
              </span>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 mb-1">
                Drop image here
              </p>
              <p className="font-body text-[11px] text-on-surface-variant/30">
                or click to browse — JPEG, PNG, WebP up to 10 MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 py-2">
          <span className="material-symbols-outlined text-error text-sm">
            error
          </span>
          <p className="font-label text-[10px] text-error">{error}</p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={isFirst}
        aria-label="Previous page"
        className="w-10 h-10 flex items-center justify-center border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:hover:text-foreground/70 disabled:hover:border-foreground/15 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_left
        </span>
      </button>

      {pages.map((p) => {
        const active = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p)}
            aria-current={active ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={`w-10 h-10 flex items-center justify-center font-label text-xs tracking-[0.15em] tabular-nums transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={isLast}
        aria-label="Next page"
        className="w-10 h-10 flex items-center justify-center border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:hover:text-foreground/70 disabled:hover:border-foreground/15 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_right
        </span>
      </button>
    </nav>
  );
}

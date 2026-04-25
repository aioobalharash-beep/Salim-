"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const mediaSubLinks = [
  { href: "/media/discography", label: "Discography" },
  { href: "/media/video", label: "Video" },
  { href: "/media/press", label: "Press" },
  { href: "/media/gallery", label: "Gallery" },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/shop", label: "Shop" },
  { href: "/media", label: "Media", children: mediaSubLinks },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About Salim" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMediaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileMediaOpen(false);
    setMediaOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-screen-2xl mx-auto">
        {/* ── Brand ── */}
        <Link
          href="/"
          className="font-serif-brand text-xl font-light tracking-[0.25em] text-on-surface uppercase"
        >
          Salim Dada
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (link.children) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMediaOpen((o) => !o)}
                    className={`flex items-center gap-1 font-label tracking-[0.15em] text-[11px] uppercase transition-colors duration-300 ${
                      isActive
                        ? "text-on-surface"
                        : "text-on-surface/40 hover:text-on-surface"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${
                        mediaOpen ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {/* Dropdown */}
                  {mediaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                      <div className="bg-background shadow-lg shadow-on-surface/[0.06] py-3 px-2 min-w-[160px]">
                        {link.children.map((sub) => {
                          const subActive = pathname.startsWith(sub.href);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`block px-5 py-2.5 font-label text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 ${
                                subActive
                                  ? "text-on-surface"
                                  : "text-on-surface/40 hover:text-on-surface"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label tracking-[0.15em] text-[11px] uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-on-surface"
                    : "text-on-surface/40 hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Right: CTA + Hamburger ── */}
        <div className="flex items-center gap-4">
          <a
            href="/#enquiry-section"
            className="hidden md:inline-block font-label tracking-[0.15em] text-[11px] uppercase px-6 py-2.5 border border-on-surface/20 text-on-surface hover:bg-on-surface hover:text-surface transition-all duration-300"
          >
            Inquiry
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 origin-center ${
                mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 origin-center ${
                mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-outline-variant/10 px-6 pb-8 pt-4">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              if (link.children) {
                return (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobileMediaOpen((o) => !o)}
                      className={`w-full flex items-center justify-between py-3 font-label tracking-[0.15em] text-[11px] uppercase transition-colors duration-300 ${
                        isActive
                          ? "text-on-surface"
                          : "text-on-surface/40"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                          mobileMediaOpen ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {mobileMediaOpen && (
                      <div className="pl-5 pb-2 flex flex-col gap-1">
                        {link.children.map((sub) => {
                          const subActive = pathname.startsWith(sub.href);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`py-2 font-label tracking-[0.15em] text-[11px] uppercase transition-colors duration-200 ${
                                subActive
                                  ? "text-on-surface"
                                  : "text-on-surface/30 hover:text-on-surface/60"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 font-label tracking-[0.15em] text-[11px] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-on-surface"
                      : "text-on-surface/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <a
              href="/#enquiry-section"
              className="mt-4 text-center font-label tracking-[0.15em] text-[11px] uppercase px-6 py-3 border border-on-surface/20 text-on-surface hover:bg-on-surface hover:text-surface transition-all duration-300"
            >
              Inquiry
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

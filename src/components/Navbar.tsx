"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/shop", label: "Shop" },
  { href: "/media", label: "Media" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About Salim" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-card">
      <div className="flex justify-between items-center px-6 md:px-12 py-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif-brand text-xl font-light tracking-widest text-on-surface uppercase"
        >
          Salim Dada
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`font-serif-brand tracking-tight text-sm uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-on-surface border-b border-primary pb-1"
                    : "text-primary/60 hover:text-on-surface"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/#enquiry-section"
          className="font-serif-brand tracking-tight text-sm uppercase px-6 py-2 bg-primary text-on-primary rounded-sm transition-opacity active:opacity-70"
        >
          Inquiry
        </Link>
      </div>
    </nav>
  );
}

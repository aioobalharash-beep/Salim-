import Link from "next/link";

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/#about", label: "UNESCO Relations" },
  { href: "/blog", label: "Newsletter" },
];

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 md:px-12 bg-surface-container-low border-t border-outline-variant/15">
      <div className="flex flex-col md:flex-row justify-between items-end w-full max-w-screen-2xl mx-auto gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4 text-left w-full md:w-auto">
          <span className="font-serif-brand text-2xl font-light tracking-widest text-on-surface uppercase mb-4">
            Salim Dada
          </span>
          <p className="font-body text-[10px] uppercase tracking-[0.1em] text-primary leading-relaxed">
            &copy; {new Date().getFullYear()} Salim Dada. All rights reserved.
            Precision in silence.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 items-center w-full md:w-auto justify-end">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="font-body text-[10px] uppercase tracking-[0.1em] text-primary/50 hover:text-primary underline underline-offset-4 transition-all duration-500 ease-in-out"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

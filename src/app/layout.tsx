import type { Metadata } from "next";
import PublicShell from "@/components/PublicShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salim Dada — Conductor · Composer · Guitarist · Scholar",
  description:
    "The official portfolio of Salim Dada: maestro, composer, classical guitarist, and UNESCO cultural envoy bridging Mediterranean musical heritage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400&family=Aref+Ruqaa:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}

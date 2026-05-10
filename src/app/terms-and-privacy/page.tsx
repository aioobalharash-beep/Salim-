import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { legalQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Terms & Privacy — Salim Dada",
  description:
    "Terms of use and privacy policy for the Salim Dada website.",
};

export const revalidate = 60;

interface LegalData {
  title?: string;
  content?: PortableTextBlock[];
}

async function getLegal(): Promise<LegalData | null> {
  return client.fetch(legalQuery);
}

export default async function TermsAndPrivacyPage() {
  const data = await getLegal();
  const title = data?.title || "Terms & Privacy";

  return (
    <main className="w-full min-h-screen bg-surface py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif-brand text-3xl md:text-5xl font-light tracking-wide text-on-surface mb-12">
          {title}
        </h1>

        <div className="prose prose-neutral max-w-none font-body text-on-surface/80 leading-relaxed">
          {data?.content && data.content.length > 0 ? (
            <PortableText
              value={data.content}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="mb-6 text-base leading-relaxed">{children}</p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-serif-brand text-2xl font-light mt-12 mb-4 text-on-surface">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-serif-brand text-xl font-light mt-8 mb-3 text-on-surface">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="font-body text-base font-medium mt-6 mb-2 text-on-surface uppercase tracking-wider">
                      {children}
                    </h4>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary/30 pl-4 italic my-6 text-on-surface/70">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-6 space-y-2">
                      {children}
                    </ol>
                  ),
                },
                marks: {
                  link: ({ value, children }) => (
                    <a
                      href={value?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary/70 transition-colors"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          ) : (
            <p className="text-on-surface/60 italic">
              Content coming soon.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

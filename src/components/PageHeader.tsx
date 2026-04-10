interface PageHeaderProps {
  tag: string;
  title: string;
  description: string;
}

export default function PageHeader({ tag, title, description }: PageHeaderProps) {
  return (
    <section className="pt-40 pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
        {tag}
      </p>
      <h1 className="font-headline text-5xl md:text-6xl font-light mb-8">
        {title}
      </h1>
      <p className="font-body text-lg leading-relaxed text-on-surface-variant max-w-2xl">
        {description}
      </p>
      <div className="w-16 h-[1px] bg-primary/30 mt-12" />
    </section>
  );
}

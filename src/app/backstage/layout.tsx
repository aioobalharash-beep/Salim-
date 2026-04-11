export const metadata = {
  title: "Backstage — Salim Dada",
  description: "Content management studio",
};

export default function BackstageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="sanity-studio"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
}

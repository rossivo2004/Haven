export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="pt-20">
        {children}
    </section>
  );
}

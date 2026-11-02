
import Link from "next/link";

export default function ComingSoon({
  title,
}: {
  title: string;
}) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-start justify-center px-6 py-20">
      <span className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#173653] dark:text-[#E2B978]">
        Yusfaith Global Enterprises
      </span>

      <h1 className="font-display text-5xl leading-tight text-foreground sm:text-7xl">
        {title}
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        We are preparing this section of our corporate
        website. Explore our homepage to discover more
        about Yusfaith Global Enterprises.
      </p>

      <Link
        href="/"
        className="mt-9 inline-flex rounded-full bg-[#142B45] px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#173653] dark:bg-[#E2B978] hover:shadow-lg"
      >
        Return to Homepage →
      </Link>
    </section>
  );
}

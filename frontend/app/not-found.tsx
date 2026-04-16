import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="glass-card mx-auto max-w-2xl p-8 text-center">
      <p
        className="text-sm uppercase tracking-[0.3em]"
        style={{ color: "var(--text-muted)" }}
      >
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Surah not found
      </h1>
      <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
        The chapter you requested could not be generated. Return to the full
        collection and choose another surah.
      </p>
      <Link
        className="glass-button mt-6 inline-flex min-h-11 items-center"
        href="/"
      >
        Back to Surah List
      </Link>
    </div>
  );
};

export default NotFoundPage;

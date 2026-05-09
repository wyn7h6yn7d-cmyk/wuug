type PageHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
};

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-token-soft bg-surface/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-soft backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
          {eyebrow}
        </div>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-fg-soft">{subtitle}</p>
    </div>
  );
}

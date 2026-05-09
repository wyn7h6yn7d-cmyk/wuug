export default function PlatformLoading() {
  return (
    <div className="space-y-6 pb-12" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[rgb(var(--fg-soft)/0.18)]" />
        <div className="h-8 w-2/3 max-w-md animate-pulse rounded-xl bg-[rgb(var(--fg-soft)/0.22)]" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded-lg bg-[rgb(var(--fg-soft)/0.14)]" />
      </div>
      <div className="h-14 w-full max-w-3xl animate-pulse rounded-[22px] bg-[rgb(var(--fg-soft)/0.12)]" />
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="h-48 animate-pulse rounded-[28px] border border-token-soft bg-surface/50" />
        </div>
        <div className="xl:col-span-5">
          <div className="h-48 animate-pulse rounded-[28px] border border-token-soft bg-surface/50" />
        </div>
      </div>
    </div>
  );
}

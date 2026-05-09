export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-teal-400 shadow-[0_6px_20px_rgba(78,120,255,0.35)]">
        <span className="absolute inset-[6px] rounded-md bg-white/80" />
      </span>
      <span className="text-xl font-semibold tracking-tight text-slate-900">wuug</span>
    </div>
  );
}

"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7FAFF] p-6 text-slate-900">
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Something went wrong</div>
          <div className="mt-2 text-sm text-slate-600">
            Please try again. If the issue persists, contact support.
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            {error?.message}
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}


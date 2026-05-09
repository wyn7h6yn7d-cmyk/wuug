import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { onboardingSteps } from "@/lib/mock-data";

export function OnboardingView() {
  return (
    <div className="min-h-screen bg-[#F7FAFF] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_12px_36px_rgba(66,86,122,0.12)] sm:p-8">
        <div className="mb-6">
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Alustame wuugiga
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Esmane seadistamine</h1>
          <p className="mt-2 text-sm text-slate-500">
            Vaid mõned lihtsad sammud ja sinu töölaud on kasutamiseks valmis.
          </p>
        </div>

        <ol className="space-y-3">
          {onboardingSteps.map((step, index) => (
            <li
              key={step}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-600">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-slate-700">{step}</p>
              </div>
              {index === 0 ? (
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                  Järgmine
                </span>
              ) : (
                <CheckCircle2 className="h-4 w-4 text-slate-300" />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white">
            Alusta esimesest sammust <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
          >
            Ava töölaud
          </Link>
        </div>
      </div>
    </div>
  );
}

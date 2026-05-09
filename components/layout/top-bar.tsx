import { Bell, Search } from "lucide-react";
import { CreateItemFlow } from "@/components/actions/create-item-flow";

export function TopBar() {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[24px] border border-[#E5EAF3] bg-white/90 p-4 shadow-[0_8px_30px_rgba(66,86,122,0.08)] md:flex-row md:items-center md:justify-between">
      <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:max-w-xl">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Otsi klienti, projekti või tegevust..."
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </label>

      <div className="flex items-center gap-2 sm:gap-3">
        <CreateItemFlow />
        <button
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]"
          aria-label="Teavitused"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 text-sm font-semibold text-slate-700">
            E
          </span>
          <span className="text-sm font-medium text-slate-700">Minu konto</span>
        </div>
      </div>
    </header>
  );
}

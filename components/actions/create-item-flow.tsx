"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, FolderPlus, Handshake, ListTodo, Plus, UserPlus, X } from "lucide-react";

type FormField = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "date";
};

type FlowItem = {
  key: "client" | "project" | "task" | "promise";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  modalTitle: string;
  fields: FormField[];
};

const flowItems: FlowItem[] = [
  {
    key: "client",
    label: "Uus klient",
    icon: UserPlus,
    modalTitle: "Uus klient",
    fields: [
      { key: "companyName", label: "Ettevõtte nimi", placeholder: "Nt Nordic OÜ" },
      { key: "contactName", label: "Kontaktisik", placeholder: "Nt Kontaktisik" },
      { key: "email", label: "E-post", placeholder: "nimi@ettevõte.ee", type: "email" },
      { key: "phone", label: "Telefon", placeholder: "+372 ...", type: "tel" },
      { key: "note", label: "Märkus", placeholder: "Oluline taustainfo kliendi kohta" },
      { key: "nextStep", label: "Järgmine samm", placeholder: "Nt Saada pakkumine" },
      { key: "dueDate", label: "Tähtaeg", placeholder: "Vali kuupäev", type: "date" },
    ],
  },
  {
    key: "project",
    label: "Uus projekt",
    icon: FolderPlus,
    modalTitle: "Uus projekt",
    fields: [
      { key: "projectName", label: "Projekti nimi", placeholder: "Nt Veebilehe arendus" },
      { key: "client", label: "Klient", placeholder: "Vali klient" },
      { key: "owner", label: "Vastutaja", placeholder: "Nt Sina" },
      { key: "dueDate", label: "Tähtaeg", placeholder: "Vali kuupäev", type: "date" },
      { key: "status", label: "Staatus", placeholder: "Nt Töös" },
      { key: "nextStep", label: "Järgmine samm", placeholder: "Nt Disain kinnitamisel" },
    ],
  },
  {
    key: "task",
    label: "Uus tegevus",
    icon: ListTodo,
    modalTitle: "Uus tegevus",
    fields: [
      { key: "taskName", label: "Tegevuse nimi", placeholder: "Nt Saada pakkumine" },
      { key: "context", label: "Klient/projekt", placeholder: "Nt Nordic OÜ / Veebilehe arendus" },
      { key: "owner", label: "Vastutaja", placeholder: "Nt Sina" },
      { key: "dueDate", label: "Tähtaeg", placeholder: "Vali kuupäev", type: "date" },
      { key: "priority", label: "Prioriteet", placeholder: "Nt Kõrge" },
      { key: "status", label: "Staatus", placeholder: "Nt Planeeritud" },
    ],
  },
  {
    key: "promise",
    label: "Uus lubadus",
    icon: Handshake,
    modalTitle: "Uus lubadus",
    fields: [
      { key: "client", label: "Klient", placeholder: "Nt Nordic OÜ" },
      { key: "promise", label: "Lubadus", placeholder: "Nt Saada pakkumine" },
      { key: "owner", label: "Vastutaja", placeholder: "Nt Sina" },
      { key: "dueDate", label: "Tähtaeg", placeholder: "Vali kuupäev", type: "date" },
      { key: "note", label: "Märkus", placeholder: "Lisainfo lubaduse kohta" },
    ],
  },
];

export function CreateItemFlow() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<FlowItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveModal(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openModal = (item: FlowItem) => {
    setMenuOpen(false);
    setActiveModal(item);
    setFormValues(Object.fromEntries(item.fields.map((field) => [field.key, ""])));
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormValues({});
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    closeModal();
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 1800);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)] transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          + Lisa uus
        </button>

        <AnimatePresence>
          {menuOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Sulge uus kirje menüü"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-20 cursor-default bg-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_40px_rgba(66,86,122,0.12)]"
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
              >
                {flowItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => openModal(item)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-slate-500" />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-xl rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_18px_44px_rgba(66,86,122,0.18)]"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{activeModal.modalTitle}</h3>
              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 p-2 text-slate-500"
                aria-label="Sulge aken"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {activeModal.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">{field.label}</span>
                  <input
                    type={field.type ?? "text"}
                    value={formValues[field.key] ?? ""}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </label>
              ))}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Tühista
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white"
                >
                  Lisa
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showToast ? (
          <motion.div
            className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(16,185,129,0.18)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Check className="h-4 w-4" />
            Lisatud
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

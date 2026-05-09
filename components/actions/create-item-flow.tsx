"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, FolderPlus, Handshake, ListTodo, Plus, UserPlus, X } from "lucide-react";
import { BTN_SPRING, BTN_TAP, btnHoverLift } from "@/lib/motion-presets";

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
    label: "New client",
    icon: UserPlus,
    modalTitle: "New client",
    fields: [
      { key: "companyName", label: "Company name", placeholder: "e.g. Nordic OÜ" },
      { key: "contactName", label: "Contact name", placeholder: "e.g. Main contact" },
      { key: "email", label: "Email", placeholder: "name@company.com", type: "email" },
      { key: "phone", label: "Phone", placeholder: "+372 …", type: "tel" },
      { key: "note", label: "Note", placeholder: "Important context about this client" },
      { key: "nextStep", label: "Next step", placeholder: "e.g. Send proposal" },
      { key: "dueDate", label: "Due date", placeholder: "Pick a date", type: "date" },
    ],
  },
  {
    key: "project",
    label: "New project",
    icon: FolderPlus,
    modalTitle: "New project",
    fields: [
      { key: "projectName", label: "Project name", placeholder: "e.g. Website build" },
      { key: "client", label: "Client", placeholder: "Select client" },
      { key: "owner", label: "Owner", placeholder: "e.g. You" },
      { key: "dueDate", label: "Due date", placeholder: "Pick a date", type: "date" },
      { key: "status", label: "Status", placeholder: "e.g. In progress" },
      { key: "nextStep", label: "Next step", placeholder: "e.g. Awaiting design approval" },
    ],
  },
  {
    key: "task",
    label: "New task",
    icon: ListTodo,
    modalTitle: "New task",
    fields: [
      { key: "taskName", label: "Task title", placeholder: "e.g. Send proposal" },
      { key: "context", label: "Client / project", placeholder: "e.g. Nordic OÜ / Website build" },
      { key: "owner", label: "Owner", placeholder: "e.g. You" },
      { key: "dueDate", label: "Due date", placeholder: "Pick a date", type: "date" },
      { key: "priority", label: "Priority", placeholder: "e.g. High" },
      { key: "status", label: "Status", placeholder: "e.g. Planned" },
    ],
  },
  {
    key: "promise",
    label: "New promise",
    icon: Handshake,
    modalTitle: "New promise",
    fields: [
      { key: "client", label: "Client", placeholder: "e.g. Nordic OÜ" },
      { key: "promise", label: "Promise", placeholder: "e.g. Send proposal" },
      { key: "owner", label: "Owner", placeholder: "e.g. You" },
      { key: "dueDate", label: "Due date", placeholder: "Pick a date", type: "date" },
      { key: "note", label: "Note", placeholder: "Extra context about this promise" },
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
        <motion.button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          whileHover={btnHoverLift("primary")}
          whileTap={BTN_TAP}
          transition={BTN_SPRING}
          className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(99,102,241,0.35)] outline-none gradient-sheen focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] [&_svg]:transition-transform hover:[&_svg]:rotate-90"
        >
          <Plus className="h-4 w-4" />
          + Add new
        </motion.button>

        <AnimatePresence>
          {menuOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close add new menu"
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
              className="w-full max-w-xl overflow-y-auto rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_18px_44px_rgba(66,86,122,0.18)] max-h-[85vh]"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{activeModal.modalTitle}</h3>
              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 p-2 text-slate-500"
                aria-label="Close modal"
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
                <motion.button
                  type="button"
                  onClick={closeModal}
                  whileHover={btnHoverLift("secondary")}
                  whileTap={BTN_TAP}
                  transition={BTN_SPRING}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={btnHoverLift("primary")}
                  whileTap={BTN_TAP}
                  transition={BTN_SPRING}
                  className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white outline-none gradient-sheen shadow-[0_10px_26px_rgba(99,102,241,0.3)] focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]"
                >
                  Add
                </motion.button>
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
            Added
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type OwnerOption = { id: string; label: string };

export type ClientFormValues = {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
  health: string;
  priority: string;
  owner_id: string;
  note: string;
  next_step: string;
  next_step_due_date: string;
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none";

function ModalShell({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl rounded-[28px] border border-[#E5EAF3] bg-white p-6 shadow-[0_18px_44px_rgba(66,86,122,0.18)]"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 p-2 text-slate-500"
                aria-label="Close modal"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type ClientFormModalProps = {
  open: boolean;
  title: string;
  owners: OwnerOption[];
  hideOwner: boolean;
  initialValues: ClientFormValues;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
};

export function ClientFormModal(props: ClientFormModalProps) {
  if (!props.open) return null;
  return <ClientFormModalInner {...props} />;
}

function ClientFormModalInner({
  title,
  owners,
  hideOwner,
  initialValues,
  submitLabel,
  busy,
  error,
  onClose,
  onSubmit,
}: Omit<ClientFormModalProps, "open">) {
  const [values, setValues] = React.useState<ClientFormValues>(initialValues);

  const set = (key: keyof ClientFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <ModalShell open title={title} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(values);
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Company name</span>
            <input value={values.name} onChange={set("name")} placeholder="e.g. Nordic OÜ" className={inputClass} required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Contact name</span>
            <input value={values.contact_name} onChange={set("contact_name")} placeholder="e.g. Katrin Saar" className={inputClass} />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
            <input type="email" value={values.email} onChange={set("email")} placeholder="name@company.com" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Phone</span>
            <input type="tel" value={values.phone} onChange={set("phone")} placeholder="+372 ..." className={inputClass} />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Status</span>
            <select value={values.status} onChange={set("status")} className={inputClass}>
              <option value="active">Active</option>
              <option value="waiting">Waiting</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Health</span>
            <select value={values.health} onChange={set("health")} className={inputClass}>
              <option value="healthy">Healthy</option>
              <option value="at_risk">At risk</option>
              <option value="needs_attention">Needs attention</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Priority</span>
            <select value={values.priority} onChange={set("priority")} className={inputClass}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        {hideOwner ? null : (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Owner</span>
            <select value={values.owner_id} onChange={set("owner_id")} className={inputClass}>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Note</span>
          <textarea value={values.note} onChange={set("note")} placeholder="Important context about this client" className={inputClass} rows={3} />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Next step</span>
            <input value={values.next_step} onChange={set("next_step")} placeholder="e.g. Send proposal" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Next step due date</span>
            <input type="date" value={values.next_step_due_date} onChange={set("next_step_due_date")} className={inputClass} />
          </label>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  busy,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <ModalShell open={open} title={title} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-slate-600">{description}</p>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function NoteModal({
  open,
  title,
  initialNote,
  submitLabel,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  initialNote: string;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (note: string) => void | Promise<void>;
}) {
  const [note, setNote] = React.useState(initialNote);

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setNote(initialNote);
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, initialNote]);

  return (
    <ModalShell open={open} title={title} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(note);
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Note</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
            className={inputClass}
            rows={5}
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function NextStepModal({
  open,
  title,
  initialNextStep,
  initialDueDate,
  submitLabel,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  initialNextStep: string;
  initialDueDate: string;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: { next_step: string; next_step_due_date: string }) => void | Promise<void>;
}) {
  const [nextStep, setNextStep] = React.useState(initialNextStep);
  const [dueDate, setDueDate] = React.useState(initialDueDate);

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setNextStep(initialNextStep);
      setDueDate(initialDueDate);
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, initialNextStep, initialDueDate]);

  return (
    <ModalShell open={open} title={title} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ next_step: nextStep, next_step_due_date: dueDate });
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Next step</span>
            <input
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="e.g. Send proposal"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Due date</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
          </label>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function AssignOwnerModal({
  open,
  title,
  owners,
  initialOwnerId,
  submitLabel,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  owners: OwnerOption[];
  initialOwnerId: string;
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (ownerId: string) => void | Promise<void>;
}) {
  const [ownerId, setOwnerId] = React.useState(initialOwnerId);

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setOwnerId(initialOwnerId);
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, initialOwnerId]);

  return (
    <ModalShell open={open} title={title} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(ownerId);
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Owner</span>
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className={inputClass}>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.label}
              </option>
            ))}
          </select>
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}


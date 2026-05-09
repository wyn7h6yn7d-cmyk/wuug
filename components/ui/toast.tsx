"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: string;
  message: string;
};

type Listener = () => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function removeToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function toast(message: string) {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const item: ToastItem = { id, message };

  toasts = [item, ...toasts].slice(0, 4);
  emit();

  window.setTimeout(() => removeToast(id), 3200);
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

export function Toaster() {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto max-w-[360px] rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur",
          )}
          role="status"
          aria-live="polite"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}


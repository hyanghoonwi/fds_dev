import { useSyncExternalStore, type ReactNode } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface ToastItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  variant: ToastVariant;
  duration: number;
}

export type ToastInput = Omit<ToastItem, "id" | "variant" | "duration"> &
  Partial<Pick<ToastItem, "variant" | "duration">>;

type Listener = () => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

export function toast(input: ToastInput) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { variant: "default", duration: 4000, ...input, id }];
  emit();
  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

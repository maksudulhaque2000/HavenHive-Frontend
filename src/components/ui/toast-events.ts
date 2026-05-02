export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastEvent {
  type: ToastType;
  message: string;
}

type Listener = (toast: ToastEvent) => void;

const listeners = new Set<Listener>();

export const toastEvents = {
  emit(toast: ToastEvent) {
    listeners.forEach((listener) => listener(toast));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
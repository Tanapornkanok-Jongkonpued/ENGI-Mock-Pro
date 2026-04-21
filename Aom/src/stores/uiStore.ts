import { create } from "zustand";
import { storage } from "../utils/storage";
import type { Language, Toast } from "../types";

interface UIState {
  language: Language;
  darkMode: boolean;
  toasts: Toast[];
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  language: storage.get<{ language: Language }>("user")?.language ?? "th",
  darkMode: storage.get<{ darkMode: boolean }>("user")?.darkMode ?? true,
  toasts: [],

  setLanguage(lang) {
    set({ language: lang });
  },
  toggleDarkMode() {
    const next = !get().darkMode;
    set({ darkMode: next });
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
  addToast(toast) {
    const id = Math.random().toString(36).slice(2);
    const t: Toast = { ...toast, id };
    set((s) => ({ toasts: [...s.toasts, t] }));
    const duration = toast.duration ?? 3500;
    setTimeout(() => get().removeToast(id), duration);
  },
  removeToast(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

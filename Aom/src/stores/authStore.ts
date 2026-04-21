import { create } from "zustand";
import { storage } from "../utils/storage";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  // temp registration data across steps
  regData: Partial<User>;
  setRegData: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storage.get<User>("user"),
  isAuthenticated: !!storage.get<User>("user"),
  regData: {},
  login(user) {
    storage.set("user", user);
    set({ user, isAuthenticated: true });
  },
  logout() {
    storage.remove("user");
    set({ user: null, isAuthenticated: false });
  },
  updateUser(partial) {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial };
    storage.set("user", updated);
    set({ user: updated });
  },
  setRegData(data) {
    set((s) => ({ regData: { ...s.regData, ...data } }));
  },
}));

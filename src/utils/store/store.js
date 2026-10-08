import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "js-electric-auth";
// Earlier versions persisted without a name, so the data sits under the key
// "undefined". Read it from there once so nobody is logged out by the rename.
const LEGACY_KEY = "undefined";

const storage = createJSONStorage(() => ({
  getItem: (name) => {
    const value = localStorage.getItem(name);
    if (value !== null || name !== STORAGE_KEY) return value;
    return localStorage.getItem(LEGACY_KEY);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
    if (name === STORAGE_KEY) localStorage.removeItem(LEGACY_KEY);
  },
  removeItem: (name) => localStorage.removeItem(name),
}));

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      laborRefresh: false,
      sidebarFlag: false,

      storeUser: (newUser) => set({ user: newUser }),
      // Called after a successful login with the user info and JWT from the API.
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      laborRefreshHandle: (flag) => set({ laborRefresh: !flag }),
      setSideBarFlag: (flag) => set({ sidebarFlag: flag }),
    }),
    {
      name: STORAGE_KEY,
      storage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
export default useStore;

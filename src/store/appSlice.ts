import type { StateCreator } from "zustand";

import type { Entry } from "../types/entry";

export type AppSlice = {
  accessCode: string | null;
  isAuthenticated: boolean;
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: Entry) => void;
  removeEntry: (entryId: string) => void;
  updateEntry: (entryId: string, updatedEntry: Entry) => void;
  clearEntries: () => void;
  setAccessCode: (accessCode: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  accessCode: null,
  isAuthenticated: false,
  entries: [],
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
    })),
  removeEntry: (entryId) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== entryId),
    })),
  updateEntry: (entryId, updatedEntry) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === entryId ? updatedEntry : entry
      ),
    })),
  clearEntries: () => set({ entries: [] }),
  setAccessCode: (accessCode) => set({ accessCode }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
});

import type { StateCreator } from "zustand";

import type { Entry } from "../types/entry";

export type EntrySlice = {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: Entry) => void;
  removeEntry: (entryId: string) => void;
  updateEntry: (entryId: string, updatedEntry: Entry) => void;
  importEntries: (entries: Entry[]) => void;
  clearEntries: () => void;
};

export const createEntrySlice: StateCreator<EntrySlice> = (set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
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
  importEntries: (entries) =>
    set((state) => ({
      entries: [
        ...entries.filter(
          (item) => !state.entries.some((entry) => entry.id === item.id)
        ),
        ...state.entries,
      ],
    })),
  clearEntries: () => set({ entries: [] }),
});

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Entry } from "../types/entry";

export type AppStore = {
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

  // Google Drive related state
  googleDriveAuthToken: string | null;
  googleDriveBackupFile: string | null;
  setGoogleDriveAuthToken: (token: string) => void;
  setGoogleDriveBackupFile: (file: string) => void;
  clearGoogleDriveData: () => void;
};

const useAppStore = create(
  persist<AppStore>(
    (set) => ({
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

      // Google Drive related state
      googleDriveAuthToken: null,
      googleDriveBackupFile: null,
      setGoogleDriveAuthToken: (token: string) =>
        set({ googleDriveAuthToken: token }),
      setGoogleDriveBackupFile: (file: string) =>
        set({ googleDriveBackupFile: file }),
      clearGoogleDriveData: () =>
        set({ googleDriveAuthToken: null, googleDriveBackupFile: null }),
    }),
    {
      name: "app-storage",
    }
  )
);

export default useAppStore;

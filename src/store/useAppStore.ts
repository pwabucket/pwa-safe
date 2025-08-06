import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createGoogleDriveSlice,
  type GoogleDriveSlice,
} from "./googleDriveSlice";
import { createAppSlice, type AppSlice } from "./appSlice";
import { createEntrySlice, type EntrySlice } from "./entrySlice";

export type AppStore = AppSlice & EntrySlice & GoogleDriveSlice;

const useAppStore = create(
  persist<AppStore>(
    (...a) => ({
      ...createAppSlice(...a),
      ...createEntrySlice(...a),
      ...createGoogleDriveSlice(...a),
    }),
    {
      name: "app-storage",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !createAppSlice.excludes.includes(key as keyof AppSlice)
          )
        ) as AppStore,
    }
  )
);

export default useAppStore;

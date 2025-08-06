import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createGoogleDriveSlice,
  type GoogleDriveSlice,
} from "./googleDriveSlice";
import { createAppSlice, type AppSlice } from "./appSlice";

export type AppStore = AppSlice & GoogleDriveSlice;

const useAppStore = create(
  persist<AppStore>(
    (...a) => ({
      ...createAppSlice(...a),
      ...createGoogleDriveSlice(...a),
    }),
    {
      name: "app-storage",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isAuthenticated"].includes(key)
          )
        ) as AppStore,
    }
  )
);

export default useAppStore;

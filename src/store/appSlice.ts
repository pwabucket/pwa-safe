import bcrypt from "bcryptjs";
import type { StateCreator } from "zustand";

export type AppSlice = {
  accessCodeHash: string | null; // persisted
  decryptedAccessCode: string | null; // in-memory only
  setAccessCode: (plain: string) => Promise<void>;
  verifyAccessCode: (input: string) => Promise<boolean>;
  clearAccessCode: () => void;
  resetAccessCode: () => void;
};

export const createAppSlice: StateCreator<AppSlice> & {
  excludes: (keyof AppSlice)[];
} = (set, get) => ({
  accessCodeHash: null,
  decryptedAccessCode: null,

  setAccessCode: async (plain) => {
    const hash = await bcrypt.hash(plain, 10);
    set({
      accessCodeHash: hash,
      decryptedAccessCode: plain, // keep in memory
    });
  },

  verifyAccessCode: async (input) => {
    const hash = get().accessCodeHash;
    if (!hash) return false;
    const match = await bcrypt.compare(input, hash);
    if (match) {
      set({ decryptedAccessCode: input });
    }
    return match;
  },

  clearAccessCode: () => {
    set({ decryptedAccessCode: null });
  },

  resetAccessCode: () => {
    set({ accessCodeHash: null, decryptedAccessCode: null });
  },
});

createAppSlice.excludes = [
  "decryptedAccessCode", // in-memory only, not persisted,
];

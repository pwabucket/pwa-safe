import bcrypt from "bcryptjs";
import type { StateCreator } from "zustand";

type AccessCodeInputType = "pin" | "password";

export type AppSlice = {
  accessCodeInputType: AccessCodeInputType;
  accessCodeHash: string | null; // persisted
  decryptedAccessCode: string | null; // in-memory only
  setAccessCodeInputType: (type: AccessCodeInputType) => void;
  toggleAccessCodeInputType: () => void;
  setAccessCode: (plain: string) => Promise<void>;
  setDecryptedAccessCode: (plain: string) => void;
  verifyAccessCode: (input: string) => Promise<boolean>;
  clearAccessCode: () => void;
  resetAccessCode: () => void;
};

export const createAppSlice: StateCreator<AppSlice> & {
  excludes: (keyof AppSlice)[];
} = (set, get) => ({
  accessCodeInputType: "pin",
  accessCodeHash: null,
  decryptedAccessCode: null,

  setAccessCodeInputType: (type: AccessCodeInputType) =>
    set({ accessCodeInputType: type }),

  toggleAccessCodeInputType: () =>
    set((state) => ({
      accessCodeInputType:
        state.accessCodeInputType === "pin" ? "password" : "pin",
    })),

  setAccessCode: async (plain) => {
    const hash = await bcrypt.hash(plain, 10);
    set({
      accessCodeHash: hash,
      decryptedAccessCode: plain, // keep in memory
    });
  },

  setDecryptedAccessCode: (plain) => {
    set({ decryptedAccessCode: plain });
  },

  verifyAccessCode: async (input) => {
    const hash = get().accessCodeHash;
    if (!hash) return false;
    return await bcrypt.compare(input, hash);
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

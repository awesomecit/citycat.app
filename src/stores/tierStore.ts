import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserTier = "free" | "premium";

interface TierState {
  tier: UserTier;
  setTier: (tier: UserTier) => void;
}

export const useTierStore = create<TierState>()(
  persist(
    (set) => ({
      tier: "free",
      setTier: (tier) => set({ tier }),
    }),
    { name: "citycat-tier" }
  )
);

/** Free tier limits */
export const FREE_LIMITS = {
  matchingResults: 3,
} as const;

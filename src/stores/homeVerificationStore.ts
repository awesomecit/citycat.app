import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VerificationPhoto {
  section: string;
  element: string;
  timestamp: string;
  confirmed: boolean;
}

export interface VerificationResult {
  completedAt: string;
  photos: VerificationPhoto[];
  answers: Record<string, string>;
  flags: string[];
  checklist: { label: string; resolved: boolean }[];
  badge: boolean;
}

interface HomeVerificationState {
  verification: VerificationResult | null;
  completeVerification: (result: VerificationResult) => void;
  resolveChecklistItem: (index: number) => void;
  clearVerification: () => void;
}

export const useHomeVerificationStore = create<HomeVerificationState>()(
  persist(
    (set) => ({
      verification: null,
      completeVerification: (result) => set({ verification: result }),
      resolveChecklistItem: (index) =>
        set((s) => {
          if (!s.verification) return s;
          const checklist = [...s.verification.checklist];
          checklist[index] = { ...checklist[index], resolved: true };
          return { verification: { ...s.verification, checklist } };
        }),
      clearVerification: () => set({ verification: null }),
    }),
    { name: "citycat-home-verification" }
  )
);

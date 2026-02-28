import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LifestyleAnswers } from "@/lib/matchingAlgorithm";

export interface MatchAlert {
  id: string;
  catId: string;
  catName: string;
  score: number;
  createdAt: string;
  read: boolean;
}

interface MatchingProfileState {
  savedProfile: LifestyleAnswers | null;
  alerts: MatchAlert[];
  saveProfile: (profile: LifestyleAnswers) => void;
  clearProfile: () => void;
  addAlert: (alert: MatchAlert) => void;
  markAlertRead: (id: string) => void;
}

const MOCK_ALERTS: MatchAlert[] = [
  {
    id: "ma1",
    catId: "4",
    catName: "Nala",
    score: 94,
    createdAt: "2026-02-24T10:00:00Z",
    read: false,
  },
  {
    id: "ma2",
    catId: "3",
    catName: "Whiskers",
    score: 87,
    createdAt: "2026-02-23T15:30:00Z",
    read: true,
  },
];

export const useMatchingProfileStore = create<MatchingProfileState>()(
  persist(
    (set) => ({
      savedProfile: null,
      alerts: MOCK_ALERTS,
      saveProfile: (profile) => set({ savedProfile: profile }),
      clearProfile: () => set({ savedProfile: null }),
      addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts] })),
      markAlertRead: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
        })),
    }),
    { name: "citycat-matching-profile" }
  )
);

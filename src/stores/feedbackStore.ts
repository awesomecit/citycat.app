import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/roles";

export type FeedbackCategory = "bug" | "feature" | "ux" | "logic" | "domain";

export interface FeedbackEntry {
  id: string;
  createdAt: string;
  category: FeedbackCategory;
  message: string;
  // auto-captured debug context
  userEmail: string;
  userName: string;
  activeRole: UserRole;
  currentPath: string;
  viewport: { width: number; height: number };
  storeSnapshot: Record<string, unknown>;
}

interface FeedbackState {
  entries: FeedbackEntry[];
  addEntry: (entry: FeedbackEntry) => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({
          entries: [entry, ...s.entries].slice(0, 200),
        })),
    }),
    { name: "citycat-feedback" }
  )
);

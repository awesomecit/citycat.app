import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuditAction = "user_created" | "user_deleted" | "roles_updated" | "role_switched" | "user_login";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  performedBy: string; // email of admin/user
  targetUser?: string; // email of affected user
  details: string;
}

interface AuditState {
  entries: AuditEntry[];
  log: (entry: Omit<AuditEntry, "id" | "timestamp">) => void;
}

let counter = 0;

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      entries: [],
      log: (entry) =>
        set((s) => ({
          entries: [
            {
              ...entry,
              id: `audit-${Date.now()}-${++counter}`,
              timestamp: new Date().toISOString(),
            },
            ...s.entries,
          ].slice(0, 500), // keep last 500
        })),
    }),
    { name: "citycat-audit" }
  )
);

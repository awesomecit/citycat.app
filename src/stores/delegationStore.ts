import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DelegablePermission } from "@/lib/permissions";

export type InviteStatus = "pending" | "accepted" | "rejected";

export interface Affiliation {
  id: string;
  /** Email of the user receiving delegation */
  userEmail: string;
  userName: string;
  /** Email of the entity (shelter/municipality) granting access */
  entityEmail: string;
  entityName: string;
  /** Granted permissions */
  permissions: DelegablePermission[];
  status: InviteStatus;
  createdAt: string;
}

interface DelegationState {
  affiliations: Affiliation[];
  invite: (aff: Omit<Affiliation, "id" | "status" | "createdAt">) => void;
  respondInvite: (id: string, accept: boolean) => void;
  updatePermissions: (id: string, permissions: DelegablePermission[]) => void;
  removeAffiliation: (id: string) => void;
}

// Demo data
const DEMO: Affiliation[] = [
  {
    id: "aff-demo-1",
    userEmail: "luna@citycat.it",
    userName: "Luna Bianchi",
    entityEmail: "rifugio@citycat.it",
    entityName: "Rifugio Felino Roma",
    permissions: ["edit_cats", "manage_tasks"],
    status: "accepted",
    createdAt: "2026-01-15T10:00:00Z",
  },
];

export const useDelegationStore = create<DelegationState>()(
  persist(
    (set) => ({
      affiliations: DEMO,

      invite: (data) =>
        set((s) => ({
          affiliations: [
            ...s.affiliations,
            { ...data, id: `aff-${Date.now()}`, status: "pending", createdAt: new Date().toISOString() },
          ],
        })),

      respondInvite: (id, accept) =>
        set((s) => ({
          affiliations: s.affiliations.map((a) =>
            a.id === id ? { ...a, status: accept ? "accepted" : "rejected" } : a
          ),
        })),

      updatePermissions: (id, permissions) =>
        set((s) => ({
          affiliations: s.affiliations.map((a) =>
            a.id === id ? { ...a, permissions } : a
          ),
        })),

      removeAffiliation: (id) =>
        set((s) => ({ affiliations: s.affiliations.filter((a) => a.id !== id) })),
    }),
    { name: "citycat-delegations" }
  )
);

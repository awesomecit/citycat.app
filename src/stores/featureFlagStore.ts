import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/roles";
import { ROLES } from "@/lib/roles";
import { ROLE_FEATURES } from "@/lib/roleFeatures";
import { useAuditStore } from "./auditStore";

export interface FeatureFlag {
  id: string;          // unique key e.g. "adopter:exploreCats"
  role: UserRole;
  labelKey: string;    // i18n label from roleFeatures
  emoji: string;
  enabled: boolean;
}

function buildDefaults(): FeatureFlag[] {
  const flags: FeatureFlag[] = [];
  for (const role of ROLES) {
    for (const feat of ROLE_FEATURES[role]) {
      flags.push({
        id: `${role}:${feat.labelKey}`,
        role,
        labelKey: feat.labelKey,
        emoji: feat.emoji,
        enabled: feat.available,
      });
    }
  }
  return flags;
}

interface FeatureFlagState {
  flags: FeatureFlag[];
  toggle: (flagId: string, performedBy: string) => void;
  toggleAllForRole: (role: UserRole, enabled: boolean, performedBy: string) => void;
  resetDefaults: (performedBy: string) => void;
  isEnabled: (role: UserRole, labelKey: string) => boolean;
}

export const useFeatureFlagStore = create<FeatureFlagState>()(
  persist(
    (set, get) => ({
      flags: buildDefaults(),
      toggle: (flagId, performedBy) => {
        const prev = get().flags.find((f) => f.id === flagId);
        set((s) => ({
          flags: s.flags.map((f) =>
            f.id === flagId ? { ...f, enabled: !f.enabled } : f
          ),
        }));
        useAuditStore.getState().log({
          action: "roles_updated",
          performedBy,
          details: `Feature flag "${flagId}" ${prev?.enabled ? "disabled" : "enabled"}`,
        });
      },
      toggleAllForRole: (role, enabled, performedBy) => {
        set((s) => ({
          flags: s.flags.map((f) =>
            f.role === role ? { ...f, enabled } : f
          ),
        }));
        useAuditStore.getState().log({
          action: "roles_updated",
          performedBy,
          details: `All feature flags for "${role}" set to ${enabled ? "enabled" : "disabled"}`,
        });
      },
      resetDefaults: (performedBy) => {
        set({ flags: buildDefaults() });
        useAuditStore.getState().log({
          action: "roles_updated",
          performedBy,
          details: "Feature flags reset to defaults",
        });
      },
      isEnabled: (role, labelKey) => {
        const flag = get().flags.find(
          (f) => f.role === role && f.labelKey === labelKey
        );
        return flag?.enabled ?? false;
      },
    }),
    { name: "citycat-feature-flags" }
  )
);

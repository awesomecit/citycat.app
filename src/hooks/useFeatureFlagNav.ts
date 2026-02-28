import { useMemo } from "react";
import { useFeatureFlagStore } from "@/stores/featureFlagStore";
import { ROLE_FEATURES } from "@/lib/roleFeatures";
import type { UserRole, NavItem } from "@/lib/roles";

/**
 * Returns a Set of paths that are disabled by feature flags for a given role.
 * Admin role is never filtered.
 */
export function useDisabledPaths(role: UserRole): Set<string> {
  const flags = useFeatureFlagStore((s) => s.flags);

  return useMemo(() => {
    if (role === "admin") return new Set<string>();

    const disabled = new Set<string>();
    const roleFeatures = ROLE_FEATURES[role];

    for (const feat of roleFeatures) {
      if (!feat.path) continue;
      const flag = flags.find((f) => f.role === role && f.labelKey === feat.labelKey);
      if (flag && !flag.enabled) {
        disabled.add(feat.path);
      }
    }

    return disabled;
  }, [role, flags]);
}

/**
 * Filter nav items based on feature flags.
 */
export function useFilteredNav(role: UserRole, items: NavItem[]): NavItem[] {
  const disabled = useDisabledPaths(role);

  return useMemo(() => {
    if (role === "admin") return items;
    return items.filter((item) => !disabled.has(item.path));
  }, [items, disabled, role]);
}

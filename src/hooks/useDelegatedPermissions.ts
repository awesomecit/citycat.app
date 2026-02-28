import { useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDelegationStore } from "@/stores/delegationStore";
import type { DelegablePermission } from "@/lib/permissions";

/**
 * Returns the set of delegated permissions the current user has
 * from any accepted affiliation, PLUS native permissions from their role.
 */
export function useDelegatedPermissions(): Set<DelegablePermission> {
  const user = useAuthStore((s) => s.user);
  const affiliations = useDelegationStore((s) => s.affiliations);

  return useMemo(() => {
    const perms = new Set<DelegablePermission>();

    if (!user) return perms;

    // Native role permissions
    const role = user.activeRole;
    if (role === "admin" || role === "shelter") {
      perms.add("edit_cats");
      perms.add("manage_applications");
      perms.add("manage_tasks");
      perms.add("manage_campaigns");
    }
    if (role === "municipality") {
      perms.add("manage_tasks");
    }

    // Delegated permissions from accepted affiliations
    for (const aff of affiliations) {
      if (aff.userEmail === user.email && aff.status === "accepted") {
        for (const p of aff.permissions) {
          perms.add(p);
        }
      }
    }

    return perms;
  }, [user, affiliations]);
}

export function useHasPermission(perm: DelegablePermission): boolean {
  const perms = useDelegatedPermissions();
  return perms.has(perm);
}

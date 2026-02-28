// Delegable permission types
export const DELEGABLE_PERMISSIONS = [
  "edit_cats",
  "manage_applications",
  "manage_tasks",
  "manage_campaigns",
] as const;

export type DelegablePermission = (typeof DELEGABLE_PERMISSIONS)[number];

export const PERMISSION_META: Record<DelegablePermission, { emoji: string; labelKey: string }> = {
  edit_cats:            { emoji: "🐱", labelKey: "delegation.perm_edit_cats" },
  manage_applications:  { emoji: "📋", labelKey: "delegation.perm_manage_applications" },
  manage_tasks:         { emoji: "✅", labelKey: "delegation.perm_manage_tasks" },
  manage_campaigns:     { emoji: "📢", labelKey: "delegation.perm_manage_campaigns" },
};

import type { UserRole } from "./roles";

export interface RoleFeature {
  emoji: string;
  labelKey: string;
  available: boolean; // true = implemented, false = coming soon
  path?: string;      // associated nav path (for feature flag filtering)
}

/**
 * Features per role. `available: true` means the feature is live,
 * `available: false` means it's planned / coming soon.
 * `path` links to the corresponding navigation route for feature flag filtering.
 */
export const ROLE_FEATURES: Record<UserRole, RoleFeature[]> = {
  adopter: [
    { emoji: "🐱", labelKey: "roleFeatures.exploreCats", available: true, path: "/cats" },
    { emoji: "🎯", labelKey: "roleFeatures.matching", available: true, path: "/matching" },
    { emoji: "⚡", labelKey: "roleFeatures.automations", available: true, path: "/automations" },
    { emoji: "❤️", labelKey: "roleFeatures.adoptionApplication", available: true, path: "/cats" },
    { emoji: "📋", labelKey: "roleFeatures.myAdoptions", available: true, path: "/adoptions" },
    { emoji: "💰", labelKey: "roleFeatures.wallet", available: true, path: "/wallet" },
    { emoji: "📅", labelKey: "roleFeatures.premiumCalendar", available: true, path: "/premium-calendar" },
    { emoji: "🏆", labelKey: "roleFeatures.loyalty", available: true, path: "/loyalty" },
    { emoji: "🛍️", labelKey: "roleFeatures.premiumShop", available: true, path: "/premium-shop" },
    { emoji: "📹", labelKey: "roleFeatures.premiumServices", available: true, path: "/premium-services" },
    { emoji: "👥", labelKey: "roleFeatures.community", available: true, path: "/community" },
    { emoji: "🚨", labelKey: "roleFeatures.missingCats", available: true, path: "/missing-cats" },
    { emoji: "🤝", labelKey: "roleFeatures.becomeFoster", available: true, path: "/foster-apply" },
  ],
  volunteer: [
    { emoji: "📋", labelKey: "roleFeatures.taskBoard", available: true, path: "/tasks" },
    { emoji: "📅", labelKey: "roleFeatures.calendar", available: true, path: "/calendar" },
    { emoji: "🚗", labelKey: "roleFeatures.relays", available: true, path: "/relays" },
    { emoji: "🐱", labelKey: "roleFeatures.followedCats", available: false, path: "/cats" },
    { emoji: "🏠", labelKey: "roleFeatures.affiliatedShelters", available: false, path: "/shelters" },
    { emoji: "👥", labelKey: "roleFeatures.community", available: false, path: "/community" },
  ],
  shelter: [
    { emoji: "📊", labelKey: "roleFeatures.dashboard", available: true, path: "/dashboard" },
    { emoji: "🐱", labelKey: "roleFeatures.catManagement", available: true, path: "/cats" },
    { emoji: "📢", labelKey: "roleFeatures.campaigns", available: true, path: "/campaigns" },
    { emoji: "🏠", labelKey: "roleFeatures.shelterProfile", available: true, path: "/profile" },
    { emoji: "👥", labelKey: "roleFeatures.volunteers", available: false, path: "/volunteers" },
    { emoji: "📦", labelKey: "roleFeatures.collectionDrives", available: false, path: "/drives" },
    { emoji: "❤️", labelKey: "roleFeatures.fundraising", available: false, path: "/fundraising" },
    { emoji: "📈", labelKey: "roleFeatures.analytics", available: false, path: "/analytics" },
  ],
  municipality: [
    { emoji: "🗺️", labelKey: "roleFeatures.territorialMap", available: true, path: "/map" },
    { emoji: "📊", labelKey: "roleFeatures.statistics", available: true, path: "/statistics" },
    { emoji: "📝", labelKey: "roleFeatures.reports", available: true, path: "/reports" },
  ],
  veterinarian: [
    { emoji: "📅", labelKey: "roleFeatures.agenda", available: false, path: "/agenda" },
    { emoji: "📋", labelKey: "roleFeatures.medicalRecords", available: false, path: "/records" },
    { emoji: "🐾", labelKey: "roleFeatures.patients", available: false, path: "/patients" },
  ],
  behaviorist: [
    { emoji: "📅", labelKey: "roleFeatures.agenda", available: false, path: "/agenda" },
    { emoji: "📋", labelKey: "roleFeatures.sessions", available: false, path: "/sessions" },
    { emoji: "📝", labelKey: "roleFeatures.followUp", available: false, path: "/followup" },
  ],
  catSitter: [
    { emoji: "🏡", labelKey: "roleFeatures.stays", available: false, path: "/stays" },
    { emoji: "📅", labelKey: "roleFeatures.calendar", available: false, path: "/calendar" },
    { emoji: "💳", labelKey: "roleFeatures.payments", available: false, path: "/payments" },
  ],
  relayDriver: [
    { emoji: "🚗", labelKey: "roleFeatures.relays", available: true, path: "/relays" },
    { emoji: "📍", labelKey: "roleFeatures.myLegs", available: true, path: "/my-legs" },
    { emoji: "📜", labelKey: "roleFeatures.history", available: false, path: "/history" },
  ],
  fosterFamily: [
    { emoji: "🐱", labelKey: "roleFeatures.fosteredCats", available: false, path: "/fostered-cats" },
    { emoji: "📖", labelKey: "roleFeatures.journal", available: false, path: "/journal" },
    { emoji: "🤝", labelKey: "roleFeatures.matching", available: false, path: "/matching" },
  ],
  breeder: [
    { emoji: "🏠", labelKey: "roleFeatures.cattery", available: false, path: "/cattery" },
    { emoji: "🐱", labelKey: "roleFeatures.kittens", available: false, path: "/kittens" },
    { emoji: "💳", labelKey: "roleFeatures.transactions", available: false, path: "/transactions" },
  ],
  artisan: [
    { emoji: "🛍️", labelKey: "roleFeatures.shop", available: false, path: "/shop" },
    { emoji: "📦", labelKey: "roleFeatures.orders", available: false, path: "/orders" },
    { emoji: "💰", labelKey: "roleFeatures.earnings", available: false, path: "/earnings" },
  ],
  admin: [
    { emoji: "📊", labelKey: "roleFeatures.globalDashboard", available: false, path: "/dashboard" },
    { emoji: "👥", labelKey: "roleFeatures.userManagement", available: false, path: "/users" },
    { emoji: "⚠️", labelKey: "roleFeatures.moderation", available: false, path: "/moderation" },
    { emoji: "🛡️", labelKey: "roleFeatures.verification", available: false, path: "/verification" },
    { emoji: "🏳️", labelKey: "roleFeatures.featureFlags", available: false, path: "/feature-flags" },
  ],
};

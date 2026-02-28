// Role definitions, colors, nav configs — Sprint 0

import {
  LayoutDashboard, Cat, Heart, User, ClipboardList, CalendarDays, Car,
  BarChart3, Megaphone, Settings, Map, FileText, Users, Brain, Home,
  CreditCard, Package, ShoppingBag, MapPin, ScrollText, Handshake,
  PawPrint, Palette, Shield, AlertTriangle, Stethoscope, Sparkles,
  Wallet, Trophy, Zap, Video,
} from "lucide-react";

export const ROLES = [
  "adopter", "volunteer", "shelter", "municipality",
  "veterinarian", "behaviorist", "catSitter", "relayDriver",
  "fosterFamily", "breeder", "artisan", "admin",
] as const;

export type UserRole = (typeof ROLES)[number];

export interface RoleMeta {
  key: UserRole;
  emoji: string;
  labelKey: string;           // i18n key
  color: string;              // HSL string for badge bg
  colorForeground: string;    // HSL string for badge text
}

export const ROLE_META: Record<UserRole, RoleMeta> = {
  adopter:       { key: "adopter",       emoji: "👤", labelKey: "roles.adopter",       color: "220 70% 55%",  colorForeground: "0 0% 100%" },
  volunteer:     { key: "volunteer",     emoji: "🙋", labelKey: "roles.volunteer",     color: "142 60% 45%",  colorForeground: "0 0% 100%" },
  shelter:       { key: "shelter",       emoji: "🏠", labelKey: "roles.shelter",       color: "25 85% 55%",   colorForeground: "0 0% 100%" },
  municipality:  { key: "municipality",  emoji: "🏛️", labelKey: "roles.municipality",  color: "270 55% 55%",  colorForeground: "0 0% 100%" },
  veterinarian:  { key: "veterinarian",  emoji: "🩺", labelKey: "roles.veterinarian",  color: "175 55% 40%",  colorForeground: "0 0% 100%" },
  behaviorist:   { key: "behaviorist",   emoji: "🧠", labelKey: "roles.behaviorist",   color: "330 50% 45%",  colorForeground: "0 0% 100%" },
  catSitter:     { key: "catSitter",     emoji: "🏡", labelKey: "roles.catSitter",     color: "42 75% 50%",   colorForeground: "0 0% 10%" },
  relayDriver:   { key: "relayDriver",   emoji: "🚗", labelKey: "roles.relayDriver",   color: "25 80% 65%",   colorForeground: "0 0% 10%" },
  fosterFamily:  { key: "fosterFamily",  emoji: "🤝", labelKey: "roles.fosterFamily",  color: "142 45% 60%",  colorForeground: "0 0% 10%" },
  breeder:       { key: "breeder",       emoji: "🐾", labelKey: "roles.breeder",       color: "180 50% 30%",  colorForeground: "0 0% 100%" },
  artisan:       { key: "artisan",       emoji: "🎨", labelKey: "roles.artisan",       color: "340 60% 60%",  colorForeground: "0 0% 100%" },
  admin:         { key: "admin",         emoji: "⚙️", labelKey: "roles.admin",         color: "0 60% 35%",    colorForeground: "0 0% 100%" },
};

// Navigation item definition
export interface NavItem {
  path: string;
  icon: typeof LayoutDashboard;
  labelKey: string;
}

// 4 fixed bottom-nav items per role
export const ROLE_BOTTOM_NAV: Record<UserRole, NavItem[]> = {
  adopter: [
    { path: "/dashboard", icon: Home, labelKey: "nav.home" },
    { path: "/cats", icon: Cat, labelKey: "nav.exploreCats" },
    { path: "/adoptions", icon: Heart, labelKey: "nav.myAdoptions" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  volunteer: [
    { path: "/tasks", icon: ClipboardList, labelKey: "nav.tasks" },
    { path: "/calendar", icon: CalendarDays, labelKey: "nav.calendar" },
    { path: "/relays", icon: Car, labelKey: "nav.relays" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  shelter: [
    { path: "/dashboard", icon: BarChart3, labelKey: "nav.dashboard" },
    { path: "/cats", icon: Cat, labelKey: "nav.cats" },
    { path: "/campaigns", icon: Megaphone, labelKey: "nav.campaigns" },
    { path: "/management", icon: Settings, labelKey: "nav.management" },
  ],
  municipality: [
    { path: "/map", icon: Map, labelKey: "nav.territorialMap" },
    { path: "/statistics", icon: BarChart3, labelKey: "nav.statistics" },
    { path: "/reports", icon: FileText, labelKey: "nav.reports" },
    { path: "/profile", icon: User, labelKey: "nav.entityProfile" },
  ],
  veterinarian: [
    { path: "/agenda", icon: CalendarDays, labelKey: "nav.agenda" },
    { path: "/records", icon: ClipboardList, labelKey: "nav.records" },
    { path: "/patients", icon: Users, labelKey: "nav.patients" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  behaviorist: [
    { path: "/agenda", icon: CalendarDays, labelKey: "nav.agenda" },
    { path: "/sessions", icon: ClipboardList, labelKey: "nav.sessions" },
    { path: "/followup", icon: ScrollText, labelKey: "nav.followUp" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  catSitter: [
    { path: "/stays", icon: Home, labelKey: "nav.stays" },
    { path: "/calendar", icon: CalendarDays, labelKey: "nav.calendar" },
    { path: "/payments", icon: CreditCard, labelKey: "nav.payments" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  relayDriver: [
    { path: "/relays", icon: Car, labelKey: "nav.relays" },
    { path: "/my-legs", icon: MapPin, labelKey: "nav.myLegs" },
    { path: "/history", icon: ScrollText, labelKey: "nav.history" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  fosterFamily: [
    { path: "/fostered-cats", icon: Cat, labelKey: "nav.fosteredCats" },
    { path: "/journal", icon: ScrollText, labelKey: "nav.journal" },
    { path: "/matching", icon: Handshake, labelKey: "nav.matching" },
    { path: "/profile", icon: User, labelKey: "nav.fosterProfile" },
  ],
  breeder: [
    { path: "/cattery", icon: Home, labelKey: "nav.myCattery" },
    { path: "/kittens", icon: Cat, labelKey: "nav.kittens" },
    { path: "/transactions", icon: CreditCard, labelKey: "nav.transactions" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  artisan: [
    { path: "/shop", icon: ShoppingBag, labelKey: "nav.myShop" },
    { path: "/orders", icon: Package, labelKey: "nav.orders" },
    { path: "/earnings", icon: CreditCard, labelKey: "nav.earnings" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ],
  admin: [
    { path: "/dashboard", icon: BarChart3, labelKey: "nav.globalDashboard" },
    { path: "/users", icon: Users, labelKey: "nav.users" },
    { path: "/moderation", icon: AlertTriangle, labelKey: "nav.moderation" },
    { path: "/system", icon: Settings, labelKey: "nav.system" },
  ],
};

// Expanded grid items per role (extras beyond the 4 fixed)
export const ROLE_EXPANDED_GRID: Record<UserRole, NavItem[]> = {
  adopter: [
    { path: "/matching", icon: Sparkles, labelKey: "nav.matching" },
    { path: "/automations", icon: Zap, labelKey: "nav.automations" },
    { path: "/wallet", icon: Wallet, labelKey: "nav.wallet" },
    { path: "/premium-calendar", icon: CalendarDays, labelKey: "nav.premiumCalendar" },
    { path: "/loyalty", icon: Trophy, labelKey: "nav.loyalty" },
    { path: "/premium-shop", icon: ShoppingBag, labelKey: "nav.premiumShop" },
    { path: "/premium-services", icon: Video, labelKey: "nav.premiumServices" },
    { path: "/explore-map", icon: Map, labelKey: "nav.exploreMap" },
    { path: "/community", icon: Users, labelKey: "nav.community" },
    { path: "/missing-cats", icon: AlertTriangle, labelKey: "nav.missingCats" },
    { path: "/foster-apply", icon: Handshake, labelKey: "nav.becomeFoster" },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  volunteer: [
    { path: "/cats", icon: Cat, labelKey: "nav.followedCats" },
    { path: "/shelters", icon: Home, labelKey: "nav.affiliatedShelters" },
    { path: "/missing-cats", icon: AlertTriangle, labelKey: "nav.missingCats" },
    { path: "/community", icon: Users, labelKey: "nav.community" },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  shelter: [
    { path: "/volunteers", icon: Users, labelKey: "nav.volunteers" },
    { path: "/drives", icon: Package, labelKey: "nav.collectionDrives" },
    { path: "/fundraising", icon: Heart, labelKey: "nav.fundraising" },
    { path: "/missing-cats", icon: AlertTriangle, labelKey: "nav.missingCats" },
    { path: "/analytics", icon: BarChart3, labelKey: "nav.analytics" },
    { path: "/marketplace-b2b", icon: ShoppingBag, labelKey: "nav.marketplaceB2B" },
    { path: "/profile", icon: User, labelKey: "nav.shelterProfile" },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  municipality: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  veterinarian: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  behaviorist: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  catSitter: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  relayDriver: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  fosterFamily: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  breeder: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  artisan: [
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
  admin: [
    { path: "/verification", icon: Shield, labelKey: "nav.verification" },
    { path: "/feature-flags", icon: Settings, labelKey: "nav.featureFlags" },
    { path: "/feedback", icon: AlertTriangle, labelKey: "nav.feedback" },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
};

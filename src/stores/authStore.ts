import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockUser } from "@/lib/mockUsers";
import type { UserRole } from "@/lib/roles";

// Migrate old persisted users that lack roles/activeRole
function migrateUser(user: MockUser | null): MockUser | null {
  if (!user) return null;
  if (!user.roles || !user.activeRole) {
    return { ...user, roles: ["adopter"] as UserRole[], activeRole: "adopter" as UserRole };
  }
  return user;
}

interface AuthState {
  user: MockUser | null;
  isLoggedIn: boolean;
  login: (user: MockUser) => void;
  logout: () => void;
  updateUser: (data: Partial<Pick<MockUser, "name" | "email" | "zone" | "bio">>) => void;
  updatePassword: (password: string) => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user: migrateUser(user), isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateUser: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),
      updatePassword: (password) =>
        set((s) => ({ user: s.user ? { ...s.user, password } : null })),
      switchRole: (role) =>
        set((s) => ({
          user: s.user && s.user.roles.includes(role)
            ? { ...s.user, activeRole: role }
            : s.user,
        })),
    }),
    {
      name: "citycat-auth",
      merge: (persisted, current) => {
        const p = persisted as AuthState;
        return {
          ...current,
          ...p,
          user: migrateUser(p?.user ?? null),
        };
      },
    }
  )
);

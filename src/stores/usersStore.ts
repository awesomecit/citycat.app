import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUsers, type MockUser } from "@/lib/mockUsers";
import type { UserRole } from "@/lib/roles";
import { useAuditStore } from "./auditStore";

interface UsersState {
  users: MockUser[];
  addUser: (user: MockUser, performedBy: string) => void;
  updateUserRoles: (email: string, roles: UserRole[], activeRole: UserRole, performedBy: string) => void;
  deleteUser: (email: string, performedBy: string) => void;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [...mockUsers],
      addUser: (user, performedBy) => {
        set((s) => ({ users: [...s.users, user] }));
        useAuditStore.getState().log({
          action: "user_created",
          performedBy,
          targetUser: user.email,
          details: `Created user "${user.name}" (${user.email}) with roles: ${user.roles.join(", ")}`,
        });
      },
      updateUserRoles: (email, roles, activeRole, performedBy) => {
        const prev = get().users.find((u) => u.email === email);
        set((s) => ({
          users: s.users.map((u) =>
            u.email === email ? { ...u, roles, activeRole } : u
          ),
        }));
        useAuditStore.getState().log({
          action: "roles_updated",
          performedBy,
          targetUser: email,
          details: `Roles changed from [${prev?.roles.join(", ")}] to [${roles.join(", ")}]`,
        });
      },
      deleteUser: (email, performedBy) => {
        const prev = get().users.find((u) => u.email === email);
        set((s) => ({ users: s.users.filter((u) => u.email !== email) }));
        useAuditStore.getState().log({
          action: "user_deleted",
          performedBy,
          targetUser: email,
          details: `Deleted user "${prev?.name}" (${email})`,
        });
      },
    }),
    { name: "citycat-users" }
  )
);

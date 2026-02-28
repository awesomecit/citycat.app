import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/roles";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "info" | "success" | "warning" | "urgent";
  targetPath?: string;
  broadcast?: boolean;
  targetRoles?: UserRole[];
  sentBy?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notif: AppNotification) => void;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Benvenuto su City Cat!", body: "Il tuo account è stato creato con successo.", read: false, createdAt: "2026-02-22T09:00:00Z", type: "success" },
  { id: "n2", title: "Nuovo gatto in adozione", body: "Whiskers (Maine Coon, 2 anni) cerca famiglia nella tua zona.", read: false, createdAt: "2026-02-21T18:30:00Z", type: "info", targetPath: "/cats/3" },
  { id: "n3", title: "Cat Meetup domani!", body: "Evento nel tuo quartiere alle 17:00.", read: true, createdAt: "2026-02-21T14:00:00Z", type: "info" },
  { id: "n4", title: "Gatto scomparso vicino a te", body: "Romeo (Certosino) non è stato visto da 48h. Zona: Centro Storico.", read: false, createdAt: "2026-02-20T10:00:00Z", type: "urgent", targetPath: "/missing-cats" },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
      markAsRead: (id) =>
        set((s) => {
          const notifications = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
        }),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      addNotification: (notif) =>
        set((s) => {
          const notifications = [notif, ...s.notifications];
          return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
        }),
    }),
    { name: "citycat-notifications" }
  )
);

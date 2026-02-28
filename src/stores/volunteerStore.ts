import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "todo" | "inProgress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  catName?: string;
  shelterName?: string;
  dueDate?: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  date: string; // ISO date string YYYY-MM-DD
  available: boolean;
  note?: string;
}

export interface RelayLeg {
  id: string;
  catName: string;
  from: string;
  to: string;
  date: string;
  status: "pending" | "confirmed" | "completed";
  photoUrl?: string;
  confirmedAt?: string;
  notes?: string;
}

export interface ShelterAffiliation {
  shelterId: string;
  shelterName: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

interface VolunteerState {
  tasks: VolunteerTask[];
  availability: AvailabilitySlot[];
  relayLegs: RelayLeg[];
  affiliations: ShelterAffiliation[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleAvailability: (date: string) => void;
  setAvailabilityNote: (date: string, note: string) => void;
  confirmRelayLeg: (id: string, photoUrl: string, notes?: string) => void;
  requestAffiliation: (shelterId: string, shelterName: string) => void;
}

const DEMO_TASKS: VolunteerTask[] = [
  {
    id: "vt1",
    title: "volunteerTasks.cleanKennels",
    description: "volunteerTasks.cleanKennelsDesc",
    status: "todo",
    priority: "high",
    shelterName: "Rifugio Micilandia",
    dueDate: "2026-02-23",
    createdAt: "2026-02-20T08:00:00Z",
  },
  {
    id: "vt2",
    title: "volunteerTasks.feedAfternoon",
    description: "volunteerTasks.feedAfternoonDesc",
    status: "todo",
    priority: "medium",
    shelterName: "Rifugio Micilandia",
    dueDate: "2026-02-22",
    createdAt: "2026-02-20T08:00:00Z",
  },
  {
    id: "vt3",
    title: "volunteerTasks.vetTransport",
    description: "volunteerTasks.vetTransportDesc",
    status: "inProgress",
    priority: "high",
    catName: "Whiskers",
    dueDate: "2026-02-22",
    createdAt: "2026-02-19T10:00:00Z",
  },
  {
    id: "vt4",
    title: "volunteerTasks.photoSession",
    description: "volunteerTasks.photoSessionDesc",
    status: "done",
    priority: "low",
    catName: "Nala",
    createdAt: "2026-02-18T12:00:00Z",
  },
];

const DEMO_RELAY_LEGS: RelayLeg[] = [
  {
    id: "rl1",
    catName: "Romeo",
    from: "Roma",
    to: "Firenze",
    date: "2026-02-24",
    status: "pending",
  },
  {
    id: "rl2",
    catName: "Micio",
    from: "Milano",
    to: "Torino",
    date: "2026-02-20",
    status: "confirmed",
    confirmedAt: "2026-02-19T15:00:00Z",
  },
  {
    id: "rl3",
    catName: "Luna",
    from: "Napoli",
    to: "Roma",
    date: "2026-02-18",
    status: "completed",
    photoUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
    confirmedAt: "2026-02-18T14:00:00Z",
    notes: "Tutto OK, gatto tranquillo durante il viaggio.",
  },
];

export const useVolunteerStore = create<VolunteerState>()(
  persist(
    (set) => ({
      tasks: DEMO_TASKS,
      availability: [],
      relayLegs: DEMO_RELAY_LEGS,
      affiliations: [],

      updateTaskStatus: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      toggleAvailability: (date) =>
        set((s) => {
          const existing = s.availability.find((a) => a.date === date);
          if (existing) {
            return {
              availability: s.availability.map((a) =>
                a.date === date ? { ...a, available: !a.available } : a
              ),
            };
          }
          return {
            availability: [...s.availability, { date, available: true }],
          };
        }),

      setAvailabilityNote: (date, note) =>
        set((s) => ({
          availability: s.availability.map((a) =>
            a.date === date ? { ...a, note } : a
          ),
        })),

      confirmRelayLeg: (id, photoUrl, notes) =>
        set((s) => ({
          relayLegs: s.relayLegs.map((l) =>
            l.id === id
              ? { ...l, status: "completed" as const, photoUrl, confirmedAt: new Date().toISOString(), notes: notes || l.notes }
              : l
          ),
        })),

      requestAffiliation: (shelterId, shelterName) =>
        set((s) => ({
          affiliations: [
            ...s.affiliations.filter((a) => a.shelterId !== shelterId),
            { shelterId, shelterName, status: "pending" as const, requestedAt: new Date().toISOString() },
          ],
        })),
    }),
    { name: "citycat-volunteer" }
  )
);

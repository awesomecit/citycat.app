import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HealthEventType = "vaccine" | "checkup" | "surgery" | "treatment" | "labTest" | "deworming" | "flea";

export interface HealthEvent {
  id: string;
  catId: string;
  type: HealthEventType;
  title: string;
  description?: string;
  date: string;          // ISO date of the event
  nextDueDate?: string;  // when the next one is due (for reminders)
  vetName?: string;
  vetClinic?: string;
  cost?: number;
  notes?: string;
  attachmentUrl?: string;
}

export interface VetBooking {
  id: string;
  catId: string;
  healthEventId?: string;
  vetClinic: string;
  date: string;
  time: string;
  reason: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface HealthRecordState {
  events: HealthEvent[];
  bookings: VetBooking[];
  addEvent: (event: HealthEvent) => void;
  addBooking: (booking: VetBooking) => void;
  cancelBooking: (id: string) => void;
}

const MOCK_EVENTS: HealthEvent[] = [
  // Micio (id: "1") — owned by u1
  {
    id: "he1", catId: "1", type: "vaccine", title: "Trivalente (RCP)",
    description: "Vaccino trivalente annuale: Rinotracheite, Calicivirus, Panleucopenia",
    date: "2025-12-10", nextDueDate: "2026-03-10",
    vetName: "Dr. Marco Verdi", vetClinic: "Clinica Veterinaria Roma Nord", cost: 45,
  },
  {
    id: "he2", catId: "1", type: "deworming", title: "Sverminazione",
    description: "Trattamento antiparassitario interno",
    date: "2026-01-15", nextDueDate: "2026-04-15",
    vetName: "Dr. Marco Verdi", vetClinic: "Clinica Veterinaria Roma Nord", cost: 20,
  },
  {
    id: "he3", catId: "1", type: "checkup", title: "Visita di controllo annuale",
    description: "Controllo generale, peso, denti, cuore. Tutto nella norma.",
    date: "2026-01-15",
    vetName: "Dr. Marco Verdi", vetClinic: "Clinica Veterinaria Roma Nord", cost: 50,
  },
  {
    id: "he4", catId: "1", type: "flea", title: "Antiparassitario esterno",
    description: "Spot-on antipulci e antizecche",
    date: "2026-02-01", nextDueDate: "2026-03-01",
    vetName: "Dr. Marco Verdi", vetClinic: "Clinica Veterinaria Roma Nord", cost: 15,
  },
  // Luna (id: "2") — owned by u1
  {
    id: "he5", catId: "2", type: "vaccine", title: "Trivalente (RCP)",
    date: "2025-11-20", nextDueDate: "2026-02-20",
    vetName: "Dr.ssa Giulia Bianchi", vetClinic: "Ambulatorio Felino Trastevere", cost: 45,
    notes: "Leggera reazione locale, monitorare."
  },
  {
    id: "he6", catId: "2", type: "labTest", title: "Esami del sangue",
    description: "Emocromo completo + profilo biochimico. Valori nella norma.",
    date: "2026-02-05",
    vetName: "Dr.ssa Giulia Bianchi", vetClinic: "Ambulatorio Felino Trastevere", cost: 80,
  },
];

const MOCK_BOOKINGS: VetBooking[] = [
  {
    id: "vb1", catId: "1", healthEventId: "he1",
    vetClinic: "Clinica Veterinaria Roma Nord",
    date: "2026-03-08", time: "10:30",
    reason: "Richiamo vaccino Trivalente (RCP)",
    status: "confirmed",
  },
];

export const useHealthRecordStore = create<HealthRecordState>()(
  persist(
    (set) => ({
      events: MOCK_EVENTS,
      bookings: MOCK_BOOKINGS,
      addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
      addBooking: (booking) => set((s) => ({ bookings: [...s.bookings, booking] })),
      cancelBooking: (id) => set((s) => ({
        bookings: s.bookings.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b),
      })),
    }),
    { name: "citycat-health-records" }
  )
);

/** Get upcoming reminders for a specific cat or all cats of a user */
export function getUpcomingReminders(events: HealthEvent[], catIds: string[], daysAhead = 30) {
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + daysAhead);

  return events
    .filter((e) => e.nextDueDate && catIds.includes(e.catId))
    .filter((e) => {
      const due = new Date(e.nextDueDate!);
      return due >= now && due <= limit;
    })
    .sort((a, b) => new Date(a.nextDueDate!).getTime() - new Date(b.nextDueDate!).getTime());
}

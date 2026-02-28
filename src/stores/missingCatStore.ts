import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MissingCatReport {
  id: string;
  catName: string;
  breed: string;
  color: string;
  age?: number;
  gender?: "male" | "female";
  photoUrl?: string;
  description: string;
  lastSeenDate: string;
  lastSeenAddress: string;
  lastSeenLat: number;
  lastSeenLng: number;
  ownerName: string;
  ownerPhone?: string;
  status: "missing" | "found" | "closed";
  createdAt: string;
  microchipId?: string;
  reward?: string;
}

export interface Sighting {
  id: string;
  reportId: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  date: string;
  reporterName: string;
  photoUrl?: string;
  confirmed: boolean;
}

interface MissingCatState {
  reports: MissingCatReport[];
  sightings: Sighting[];
  addReport: (r: MissingCatReport) => void;
  addSighting: (s: Sighting) => void;
  updateReportStatus: (id: string, status: MissingCatReport["status"]) => void;
}

const MOCK_REPORTS: MissingCatReport[] = [
  {
    id: "mc1",
    catName: "Romeo",
    breed: "Certosino",
    color: "Grigio",
    age: 4,
    gender: "male",
    description: "Gatto grigio con occhi ambra, collare rosso con medaglietta. Molto timido con gli estranei. Ha una piccola cicatrice sull'orecchio sinistro.",
    lastSeenDate: "2026-02-20",
    lastSeenAddress: "Via del Corso 120, Roma",
    lastSeenLat: 41.9028,
    lastSeenLng: 12.4800,
    ownerName: "Carlo Neri",
    ownerPhone: "+39 333 1234567",
    status: "missing",
    createdAt: "2026-02-20T10:30:00Z",
    microchipId: "380260000456789",
    reward: "Ricompensa €100",
  },
  {
    id: "mc2",
    catName: "Stellina",
    breed: "Europeo",
    color: "Tricolore (bianca, arancione, nera)",
    age: 2,
    gender: "female",
    description: "Gattina piccola, molto socievole. Ha un collarino blu con campanellino. Sterilizzata.",
    lastSeenDate: "2026-02-22",
    lastSeenAddress: "Piazza Navona, Roma",
    lastSeenLat: 41.8992,
    lastSeenLng: 12.4731,
    ownerName: "Francesca Gialli",
    status: "missing",
    createdAt: "2026-02-22T16:00:00Z",
  },
  {
    id: "mc3",
    catName: "Nerone",
    breed: "Bombay",
    color: "Nero",
    age: 6,
    gender: "male",
    description: "Gatto tutto nero, occhi verdi. Molto grande e muscoloso. Si chiama se gli dici 'Nené'.",
    lastSeenDate: "2026-02-15",
    lastSeenAddress: "Via Appia Nuova 200, Roma",
    lastSeenLat: 41.8764,
    lastSeenLng: 12.5100,
    ownerName: "Marco Rossi",
    ownerPhone: "+39 347 9876543",
    status: "found",
    createdAt: "2026-02-15T08:00:00Z",
  },
];

const MOCK_SIGHTINGS: Sighting[] = [
  {
    id: "s1", reportId: "mc1", description: "Ho visto un gatto grigio simile vicino al bar di Via Condotti, sembrava spaventato.",
    address: "Via Condotti 45, Roma", lat: 41.9055, lng: 12.4800,
    date: "2026-02-21T09:00:00Z", reporterName: "Anna V.", confirmed: false,
  },
  {
    id: "s2", reportId: "mc1", description: "Gatto grigio con collare rosso nella zona di Piazza di Spagna, mangiava da una ciotola lasciata fuori da un ristorante.",
    address: "Piazza di Spagna, Roma", lat: 41.9060, lng: 12.4826,
    date: "2026-02-22T18:30:00Z", reporterName: "Luigi M.", confirmed: true,
  },
  {
    id: "s3", reportId: "mc1", description: "Possibile avvistamento in Via del Babuino, si nascondeva sotto un'auto.",
    address: "Via del Babuino 80, Roma", lat: 41.9075, lng: 12.4810,
    date: "2026-02-23T07:15:00Z", reporterName: "Giulia R.", confirmed: false,
  },
  {
    id: "s4", reportId: "mc2", description: "Gattina tricolore vista nel cortile di un palazzo vicino a Piazza Navona.",
    address: "Vicolo della Pace, Roma", lat: 41.8988, lng: 12.4710,
    date: "2026-02-23T14:00:00Z", reporterName: "Marco T.", confirmed: false,
  },
];

export const useMissingCatStore = create<MissingCatState>()(
  persist(
    (set) => ({
      reports: MOCK_REPORTS,
      sightings: MOCK_SIGHTINGS,
      addReport: (r) => set((s) => ({ reports: [r, ...s.reports] })),
      addSighting: (s) => set((st) => ({ sightings: [...st.sightings, s] })),
      updateReportStatus: (id, status) => set((s) => ({
        reports: s.reports.map((r) => r.id === id ? { ...r, status } : r),
      })),
    }),
    { name: "citycat-missing-cats" }
  )
);

import { create } from "zustand";

export interface CatColony {
  id: string;
  name: string;
  lat: number;
  lng: number;
  catCount: number;
  sterilized: number;
  lastCensus: string;
  status: "active" | "monitored" | "critical";
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: "abandoned" | "injured" | "colony" | "nuisance" | "other";
  status: "open" | "inProgress" | "resolved" | "closed";
  createdAt: string;
  reporterName: string;
  lat?: number;
  lng?: number;
  address?: string;
  notes?: string;
}

interface MunicipalityState {
  colonies: CatColony[];
  reports: Report[];
  updateReportStatus: (id: string, status: Report["status"], notes?: string) => void;
}

const mockColonies: CatColony[] = [
  { id: "c1", name: "Colonia Parco Centrale", lat: 41.9028, lng: 12.4964, catCount: 14, sterilized: 11, lastCensus: "2026-01-15", status: "active" },
  { id: "c2", name: "Colonia Trastevere", lat: 41.8892, lng: 12.4700, catCount: 8, sterilized: 8, lastCensus: "2026-02-01", status: "monitored" },
  { id: "c3", name: "Colonia Testaccio", lat: 41.8764, lng: 12.4753, catCount: 22, sterilized: 12, lastCensus: "2025-11-20", status: "critical" },
  { id: "c4", name: "Colonia Villa Borghese", lat: 41.9142, lng: 12.4921, catCount: 6, sterilized: 6, lastCensus: "2026-02-10", status: "active" },
  { id: "c5", name: "Colonia EUR", lat: 41.8303, lng: 12.4686, catCount: 18, sterilized: 10, lastCensus: "2025-12-05", status: "critical" },
];

const mockReports: Report[] = [
  { id: "r1", title: "Gatto ferito in Via Roma", description: "Gatto zoppicante avvistato vicino al parco. Sembra avere una zampa ferita.", category: "injured", status: "open", createdAt: "2026-02-20T10:00:00Z", reporterName: "Maria Rossi", address: "Via Roma 42" },
  { id: "r2", title: "Nuova colonia non censita", description: "Gruppo di 5-6 gatti in zona industriale, non sembrano sterilizzati.", category: "colony", status: "open", createdAt: "2026-02-19T14:30:00Z", reporterName: "Luigi Verdi", address: "Via dell'Industria 15" },
  { id: "r3", title: "Gatto abbandonato in scatola", description: "Trovato gatto in una scatola davanti al supermercato.", category: "abandoned", status: "inProgress", createdAt: "2026-02-18T09:00:00Z", reporterName: "Anna Bianchi", address: "Piazza del Mercato 3", notes: "Volontario inviato." },
  { id: "r4", title: "Lamentele rumore notturno", description: "Residenti si lamentano di miagolii notturni dalla colonia vicina.", category: "nuisance", status: "resolved", createdAt: "2026-02-15T22:00:00Z", reporterName: "Carlo Neri", address: "Via Quiete 8", notes: "Colonia verificata, sterilizzazioni programmate." },
  { id: "r5", title: "Ciotole d'acqua vuote", description: "Le ciotole della colonia di Testaccio sono vuote e sporche.", category: "other", status: "open", createdAt: "2026-02-21T16:00:00Z", reporterName: "Francesca Gialli", address: "Via Testaccio 22" },
];

export const useMunicipalityStore = create<MunicipalityState>((set) => ({
  colonies: mockColonies,
  reports: mockReports,
  updateReportStatus: (id, status, notes) =>
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === id ? { ...r, status, ...(notes ? { notes } : {}) } : r
      ),
    })),
}));

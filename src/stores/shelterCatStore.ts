import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatProfile } from "@/api/types";

interface ShelterCatState {
  cats: CatProfile[];
  addCat: (cat: CatProfile) => void;
  updateCat: (id: string, data: Partial<CatProfile>) => void;
  deleteCat: (id: string) => void;
}

const DEMO_SHELTER_CATS: CatProfile[] = [
  {
    id: "sc1", name: "Pallino", breed: "Europeo", age: 2, ownerId: "shelter1",
    status: "sheltered", gender: "male", vaccinated: true, sterilized: true,
    microchipped: true, microchipId: "380260000123456",
    healthStatus: "healthy", personality: ["playful", "affectionate"],
    compatibility: ["cats", "children"], color: "Bianco e grigio", weight: 4.2,
    description: "Gatto dolcissimo, adora giocare con le palline.",
    backstory: "Trovato in un parco a 3 mesi, cresciuto al rifugio.",
    arrivalDate: "2025-08-15", shelterName: "Rifugio Felino Roma",
    behavioralProfile: {
      sociabilityHumans: 5, sociabilityCats: 4,
      sociabilityChildren: "yes", sociabilityDogs: "untested",
      energyLevel: 4, aloneToleranceHours: 4,
      vocality: "normal", affectionStyle: "seeks",
      specialBehaviors: ["follows_everywhere", "sleeps_nearby"],
      source: "shelter",
    },
  },
  {
    id: "sc2", name: "Briciola", breed: "Persiano mix", age: 6, ownerId: "shelter1",
    status: "adoption", gender: "female", vaccinated: true, sterilized: true,
    microchipped: true, microchipId: "380260000789012",
    healthStatus: "chronic", healthNotes: "IRC stadio 2, dieta renale. FIV positiva.",
    personality: ["calm", "affectionate"], compatibility: ["elderly"],
    color: "Crema", weight: 3.8,
    description: "Gatta tranquilla, perfetta per chi cerca compagnia silenziosa.",
    backstory: "Ceduta dalla proprietaria anziana ricoverata.",
    arrivalDate: "2025-05-20", shelterName: "Rifugio Felino Roma",
    behavioralProfile: {
      sociabilityHumans: 4, sociabilityCats: 2,
      sociabilityChildren: "no", sociabilityDogs: "no",
      energyLevel: 1, aloneToleranceHours: 8,
      vocality: "silent", affectionStyle: "accepts",
      specialBehaviors: ["own_bowl_only", "private_litter_only"],
      source: "shelter",
    },
    heartAdoption: {
      isHeartAdoption: true,
      narrative: "Briciola ha vissuto 5 anni con la sua proprietaria prima di arrivare al rifugio. Il cambiamento l'ha spaventata, ma giorno dopo giorno ha ricominciato a fidarsi.",
      challenges: "FIV positiva e insufficienza renale cronica: richiede dieta speciale e controlli veterinari regolari. Ha bisogno di un ambiente tranquillo senza altri gatti.",
      lookingFor: "Una persona paziente, possibilmente senza altri animali, che le offra un angolo caldo e tanto silenzio. Ideale per chi lavora da casa.",
      smallVictories: "Dopo 3 mesi al rifugio, ha iniziato a fare le fusa quando le si parla dolcemente. Ora accetta le carezze sulla testa.",
      autoSuggested: true,
      suggestedReasons: ["heartAdoption.reason_chronic", "heartAdoption.reason_fiv", "heartAdoption.reason_longStay"],
    },
  },
  {
    id: "sc3", name: "Fulmine", breed: "Soriano", age: 1, ownerId: "shelter1",
    status: "adoption", gender: "male", vaccinated: true, sterilized: false,
    microchipped: false, healthStatus: "healthy",
    personality: ["playful", "curious", "independent"],
    compatibility: ["cats", "dogs", "children"], color: "Tigrato rosso", weight: 3.1,
    description: "Energia pura! Cerca una famiglia con spazio per correre.",
    backstory: "Nato in colonia, socializzato dai volontari.",
    arrivalDate: "2026-01-10", shelterName: "Rifugio Felino Roma",
    behavioralProfile: {
      sociabilityHumans: 3, sociabilityCats: 5,
      sociabilityChildren: "yes", sociabilityDogs: "yes",
      energyLevel: 5, aloneToleranceHours: 3,
      vocality: "vocal", affectionStyle: "seeks",
      specialBehaviors: ["hunts_objects", "follows_everywhere", "fears_loud_noises"],
      source: "volunteer",
    },
  },
];

export const useShelterCatStore = create<ShelterCatState>()(
  persist(
    (set) => ({
      cats: DEMO_SHELTER_CATS,
      addCat: (cat) => set((s) => ({ cats: [...s.cats, cat] })),
      updateCat: (id, data) =>
        set((s) => ({ cats: s.cats.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      deleteCat: (id) => set((s) => ({ cats: s.cats.filter((c) => c.id !== id) })),
    }),
    { name: "citycat-shelter-cats" }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt?: string;
  locked: boolean;
}

export interface LoyaltyState {
  points: number;
  level: number;
  title: string;
  badges: Badge[];
  isVerifiedAdopter: boolean;
}

const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Primo Amore", emoji: "💕", description: "Prima adozione completata", earnedAt: "2026-01-20", locked: false },
  { id: "b2", name: "Veterano", emoji: "🏅", description: "3+ adozioni completate", locked: true },
  { id: "b3", name: "Community Star", emoji: "⭐", description: "50+ post nella community", earnedAt: "2026-02-10", locked: false },
  { id: "b4", name: "Cuore d'Oro", emoji: "💛", description: "Adozione del Cuore completata", locked: true },
  { id: "b5", name: "Esploratore", emoji: "🗺️", description: "Visitato 5 rifugi diversi", locked: true },
  { id: "b6", name: "Mecenate", emoji: "🎁", description: "Donato a 3 raccolte fondi", earnedAt: "2026-02-15", locked: false },
  { id: "b7", name: "Salvatore", emoji: "🦸", description: "Segnalato gatto scomparso ritrovato", locked: true },
  { id: "b8", name: "Premium Pioneer", emoji: "👑", description: "Primo mese premium", earnedAt: "2026-02-01", locked: false },
];

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    () => ({
      points: 1280,
      level: 4,
      title: "Cat Whisperer",
      badges: MOCK_BADGES,
      isVerifiedAdopter: true,
    }),
    { name: "citycat-loyalty" }
  )
);

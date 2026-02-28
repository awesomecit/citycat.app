import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface ShelterProfileData {
  description: string;
  zone: string;
  phone: string;
  website: string;
  photoUrl?: string;
  activeCampaigns: number;
  totalCats: number;
  totalAdoptions: number;
}

export interface VerificationRequest {
  id: string;
  shelterEmail: string;
  shelterName: string;
  documentName: string;
  status: VerificationStatus;
  requestedAt: string;
  reviewedAt?: string;
  notes?: string;
}

interface ShelterState {
  profileData: ShelterProfileData;
  verificationStatus: VerificationStatus;
  verificationRequests: VerificationRequest[];
  updateProfileData: (data: Partial<ShelterProfileData>) => void;
  requestVerification: (documentName: string, shelterEmail: string, shelterName: string) => void;
}

export const useShelterStore = create<ShelterState>()(
  persist(
    (set) => ({
      profileData: {
        description: "Rifugio dedicato alla cura e adozione di gatti abbandonati nel territorio romano. Attivi dal 2018.",
        zone: "Roma",
        phone: "+39 06 1234567",
        website: "https://rifugiofelinoroma.it",
        activeCampaigns: 3,
        totalCats: 42,
        totalAdoptions: 128,
      },
      verificationStatus: "unverified",
      verificationRequests: [],

      updateProfileData: (data) =>
        set((s) => ({ profileData: { ...s.profileData, ...data } })),

      requestVerification: (documentName, shelterEmail, shelterName) =>
        set((s) => ({
          verificationStatus: "pending" as const,
          verificationRequests: [
            ...s.verificationRequests,
            {
              id: `vr-${Date.now()}`,
              shelterEmail,
              shelterName,
              documentName,
              status: "pending" as const,
              requestedAt: new Date().toISOString(),
            },
          ],
        })),
    }),
    { name: "citycat-shelter" }
  )
);

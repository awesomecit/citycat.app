import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoutineStep, RoutineStepStatus } from "./adoptionStore";

export interface CampaignRoutineTemplate {
  id: string;
  title: string;       // i18n key
  roleKey: string;      // i18n key for responsible role
  mandatory: boolean;
}

export interface AdoptionCampaign {
  id: string;
  catId: string;
  catName: string;
  shelterName: string;
  status: "active" | "paused" | "closed";
  createdAt: string;
  routineTemplate: CampaignRoutineTemplate[];
  applicationsCount: number;
}

interface CampaignState {
  campaigns: AdoptionCampaign[];
  createCampaign: (campaign: AdoptionCampaign) => void;
  updateCampaignStatus: (id: string, status: AdoptionCampaign["status"]) => void;
  deleteCampaign: (id: string) => void;
}

const DEFAULT_ROUTINE_TEMPLATE: CampaignRoutineTemplate[] = [
  { id: "rt1", title: "routineLine.applicationSubmitted", roleKey: "roles.adopter", mandatory: true },
  { id: "rt2", title: "routineLine.documentReview", roleKey: "roles.shelter", mandatory: true },
  { id: "rt3", title: "routineLine.interview", roleKey: "roles.shelter", mandatory: true },
  { id: "rt4", title: "routineLine.homeVisit", roleKey: "roles.volunteer", mandatory: true },
  { id: "rt5", title: "routineLine.meetAndGreet", roleKey: "roles.shelter", mandatory: false },
  { id: "rt6", title: "routineLine.contractSign", roleKey: "roles.shelter", mandatory: true },
  { id: "rt7", title: "routineLine.adoption", roleKey: "roles.adopter", mandatory: true },
];

const DEMO_CAMPAIGNS: AdoptionCampaign[] = [
  {
    id: "camp1", catId: "sc2", catName: "Briciola", shelterName: "Rifugio Felino Roma",
    status: "active", createdAt: "2026-02-18T10:00:00Z", applicationsCount: 1,
    routineTemplate: DEFAULT_ROUTINE_TEMPLATE,
  },
  {
    id: "camp2", catId: "sc3", catName: "Fulmine", shelterName: "Rifugio Felino Roma",
    status: "active", createdAt: "2026-02-20T14:00:00Z", applicationsCount: 0,
    routineTemplate: DEFAULT_ROUTINE_TEMPLATE.filter((s) => s.id !== "rt5"),
  },
];

export { DEFAULT_ROUTINE_TEMPLATE };

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      campaigns: DEMO_CAMPAIGNS,

      createCampaign: (campaign) =>
        set((s) => ({ campaigns: [...s.campaigns, campaign] })),

      updateCampaignStatus: (id, status) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      deleteCampaign: (id) =>
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),
    }),
    { name: "citycat-campaigns" }
  )
);

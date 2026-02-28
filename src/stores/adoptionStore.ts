import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdoptionStatus = "draft" | "submitted" | "reviewing" | "approved" | "rejected" | "waitlisted" | "completed";

export interface AdoptionApplication {
  id: string;
  catId: string;
  applicantEmail: string;
  applicantName: string;
  status: AdoptionStatus;
  createdAt: string;
  // Step 1: Housing
  housingType: string;
  housingArea: string;
  hasGarden: boolean;
  floor: string;
  // Step 2: Lifestyle
  adultsCount: number;
  childrenAges: string;
  otherAnimals: string;
  absenceHours: number;
  // Step 3: Experience
  catExperience: string;
  previousAdoptions: boolean;
  // Step 4: Motivation
  motivation: string;
  notes: string;
  // Decision
  decisionNote?: string;
  decidedAt?: string;
}

export type RoutineStepStatus = "done" | "inProgress" | "pending";

export interface RoutineStep {
  id: string;
  title: string;
  roleKey: string;
  status: RoutineStepStatus;
  completedAt?: string;
}

interface AdoptionState {
  applications: AdoptionApplication[];
  routineSteps: Record<string, RoutineStep[]>; // keyed by applicationId
  submitApplication: (app: AdoptionApplication) => void;
  updateApplicationStatus: (id: string, status: AdoptionStatus, decisionNote?: string) => void;
  updateRoutineStep: (appId: string, stepId: string, status: RoutineStepStatus) => void;
}

const DEFAULT_ROUTINE_STEPS: RoutineStep[] = [
  { id: "s1", title: "routineLine.applicationSubmitted", roleKey: "roles.adopter", status: "done" },
  { id: "s2", title: "routineLine.documentReview", roleKey: "roles.shelter", status: "inProgress" },
  { id: "s3", title: "routineLine.homeVisit", roleKey: "roles.volunteer", status: "pending" },
  { id: "s4", title: "routineLine.meetAndGreet", roleKey: "roles.shelter", status: "pending" },
  { id: "s5", title: "routineLine.finalApproval", roleKey: "roles.shelter", status: "pending" },
  { id: "s6", title: "routineLine.adoption", roleKey: "roles.adopter", status: "pending" },
];

// Pre-seeded demo application
const DEMO_APPLICATIONS: AdoptionApplication[] = [
  {
    id: "app-demo-1",
    catId: "3",
    applicantEmail: "mario@citycat.it",
    applicantName: "Mario Rossi",
    status: "reviewing",
    createdAt: "2026-02-20T10:00:00Z",
    housingType: "apartment",
    housingArea: "80-120",
    hasGarden: false,
    floor: "3",
    adultsCount: 2,
    childrenAges: "",
    otherAnimals: "none",
    absenceHours: 8,
    catExperience: "haveCats",
    previousAdoptions: false,
    motivation: "Amo i gatti e voglio dare una casa a Whiskers. Ho già esperienza con gatti europei e il mio appartamento è perfetto per un Maine Coon.",
    notes: "",
  },
];

const DEMO_ROUTINE_STEPS: Record<string, RoutineStep[]> = {
  "app-demo-1": [
    { id: "s1", title: "routineLine.applicationSubmitted", roleKey: "roles.adopter", status: "done", completedAt: "2026-02-20T10:00:00Z" },
    { id: "s2", title: "routineLine.documentReview", roleKey: "roles.shelter", status: "inProgress" },
    { id: "s3", title: "routineLine.homeVisit", roleKey: "roles.volunteer", status: "pending" },
    { id: "s4", title: "routineLine.meetAndGreet", roleKey: "roles.shelter", status: "pending" },
    { id: "s5", title: "routineLine.finalApproval", roleKey: "roles.shelter", status: "pending" },
    { id: "s6", title: "routineLine.adoption", roleKey: "roles.adopter", status: "pending" },
  ],
};

export const useAdoptionStore = create<AdoptionState>()(
  persist(
    (set) => ({
      applications: DEMO_APPLICATIONS,
      routineSteps: DEMO_ROUTINE_STEPS,
      submitApplication: (app) =>
        set((s) => ({
          applications: [...s.applications, app],
          routineSteps: {
            ...s.routineSteps,
            [app.id]: DEFAULT_ROUTINE_STEPS.map((step) => ({ ...step })),
          },
        })),
      updateApplicationStatus: (id, status, decisionNote) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status, decisionNote, decidedAt: new Date().toISOString() } : a
          ),
        })),
      updateRoutineStep: (appId, stepId, status) =>
        set((s) => ({
          routineSteps: {
            ...s.routineSteps,
            [appId]: (s.routineSteps[appId] || []).map((step) =>
              step.id === stepId
                ? { ...step, status, completedAt: status === "done" ? new Date().toISOString() : undefined }
                : step
            ),
          },
        })),
    }),
    { name: "citycat-adoptions" }
  )
);

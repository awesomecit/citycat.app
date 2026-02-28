import type { AdoptionApplication } from "@/stores/adoptionStore";

export interface ScoringCriterion {
  id: string;
  labelKey: string;       // i18n key
  weight: number;         // 0-100, sum = 100
  score: number;          // 0-100 individual score
  weightedScore: number;  // score * weight / 100
}

export interface ScoringResult {
  total: number;          // 0-100
  criteria: ScoringCriterion[];
}

// Default weights – visible & tunable by shelter
export const DEFAULT_WEIGHTS: Record<string, number> = {
  housing: 25,
  experience: 25,
  absence: 20,
  lifestyle: 15,
  motivation: 15,
};

function scoreHousing(app: AdoptionApplication): number {
  let s = 50;
  if (app.housingType === "houseGarden") s = 100;
  else if (app.housingType === "house") s = 80;
  else if (app.housingType === "apartment") s = 60;
  if (app.hasGarden) s = Math.min(100, s + 15);
  if (app.housingArea === "80-120") s = Math.min(100, s + 5);
  else if (app.housingArea === ">120") s = Math.min(100, s + 10);
  return s;
}

function scoreExperience(app: AdoptionApplication): number {
  let s = 30;
  if (app.catExperience === "fostered") s = 100;
  else if (app.catExperience === "haveCats") s = 85;
  else if (app.catExperience === "hadCats") s = 65;
  if (app.previousAdoptions) s = Math.min(100, s + 15);
  return s;
}

function scoreAbsence(app: AdoptionApplication): number {
  const h = app.absenceHours;
  if (h <= 4) return 100;
  if (h <= 6) return 80;
  if (h <= 8) return 60;
  if (h <= 10) return 40;
  return 20;
}

function scoreLifestyle(app: AdoptionApplication): number {
  let s = 60;
  if (app.adultsCount >= 2) s += 10;
  if (app.otherAnimals === "none") s += 15;
  else if (app.otherAnimals === "cats") s += 10;
  if (!app.childrenAges || app.childrenAges.trim() === "") s += 10;
  return Math.min(100, s);
}

function scoreMotivation(app: AdoptionApplication): number {
  const len = (app.motivation || "").length;
  if (len >= 200) return 100;
  if (len >= 100) return 75;
  if (len >= 50) return 50;
  return 25;
}

export function calculateScore(
  app: AdoptionApplication,
  weights: Record<string, number> = DEFAULT_WEIGHTS
): ScoringResult {
  const rawScores: Record<string, number> = {
    housing: scoreHousing(app),
    experience: scoreExperience(app),
    absence: scoreAbsence(app),
    lifestyle: scoreLifestyle(app),
    motivation: scoreMotivation(app),
  };

  const criteria: ScoringCriterion[] = Object.entries(rawScores).map(([id, score]) => {
    const weight = weights[id] || 0;
    return {
      id,
      labelKey: `scoring.${id}`,
      weight,
      score,
      weightedScore: Math.round((score * weight) / 100),
    };
  });

  const total = criteria.reduce((acc, c) => acc + c.weightedScore, 0);

  return { total, criteria };
}

export function scoreColor(total: number): string {
  if (total >= 75) return "text-primary";
  if (total >= 50) return "text-accent-foreground";
  return "text-destructive";
}

export function scoreBgColor(total: number): string {
  if (total >= 75) return "bg-primary/10";
  if (total >= 50) return "bg-accent";
  return "bg-destructive/10";
}

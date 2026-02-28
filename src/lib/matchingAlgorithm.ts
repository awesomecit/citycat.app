import type { CatProfile } from "@/api/types";

/** Adopter lifestyle answers */
export interface LifestyleAnswers {
  hoursAway: number;         // 0-12 hours away from home daily
  hasChildren: boolean;
  hasOtherCats: boolean;
  hasOtherDogs: boolean;
  livingSpace: "small" | "medium" | "large"; // apartment size
  energyPreference: "calm" | "moderate" | "active";
  experienceLevel: "first" | "some" | "expert";
  monthlyBudget: "low" | "medium" | "high"; // <30€, 30-80€, 80+€
  specialSituation: "none" | "pregnancy" | "elderly" | "disability";
  noisePreference: "silent" | "normal" | "noMatter";
}

export interface MatchResult {
  cat: CatProfile;
  score: number;        // 0-100
  reasons: MatchReason[];
}

export interface MatchReason {
  key: string;          // i18n key
  positive: boolean;    // true = pro, false = con
  weight: number;       // how much it affected the score
}

/**
 * Calculate compatibility score between adopter lifestyle and a cat.
 * Returns 0-100 score with human-readable reasons.
 */
export function calculateMatch(answers: LifestyleAnswers, cat: CatProfile): MatchResult {
  const reasons: MatchReason[] = [];
  let score = 50; // baseline

  const bp = cat.behavioralProfile;

  // 1. ALONE TOLERANCE vs hours away (heavy weight)
  if (bp) {
    const tolerance = bp.aloneToleranceHours;
    if (answers.hoursAway <= tolerance) {
      const bonus = Math.min(15, (tolerance - answers.hoursAway) * 3);
      score += bonus;
      reasons.push({ key: "matching.reason_aloneOk", positive: true, weight: bonus });
    } else {
      const penalty = Math.min(20, (answers.hoursAway - tolerance) * 5);
      score -= penalty;
      reasons.push({ key: "matching.reason_aloneTooLong", positive: false, weight: penalty });
    }
  } else {
    // No behavioral profile: mild penalty for long absences with any cat
    if (answers.hoursAway > 8) {
      score -= 5;
      reasons.push({ key: "matching.reason_longAbsenceUnknown", positive: false, weight: 5 });
    }
  }

  // 2. CHILDREN compatibility
  if (answers.hasChildren) {
    if (bp?.sociabilityChildren === "yes" || cat.compatibility?.includes("children")) {
      score += 12;
      reasons.push({ key: "matching.reason_childrenOk", positive: true, weight: 12 });
    } else if (bp?.sociabilityChildren === "no") {
      score -= 18;
      reasons.push({ key: "matching.reason_childrenNo", positive: false, weight: 18 });
    } else {
      score -= 5;
      reasons.push({ key: "matching.reason_childrenUntested", positive: false, weight: 5 });
    }
  }

  // 3. OTHER CATS
  if (answers.hasOtherCats) {
    if (bp && bp.sociabilityCats >= 4) {
      score += 10;
      reasons.push({ key: "matching.reason_catsOk", positive: true, weight: 10 });
    } else if (bp && bp.sociabilityCats <= 2) {
      score -= 15;
      reasons.push({ key: "matching.reason_catsNo", positive: false, weight: 15 });
    }
  } else {
    // No other cats — great for cats who prefer being alone
    if (bp && bp.sociabilityCats <= 2) {
      score += 8;
      reasons.push({ key: "matching.reason_onlyCatOk", positive: true, weight: 8 });
    }
  }

  // 4. OTHER DOGS
  if (answers.hasOtherDogs) {
    if (bp?.sociabilityDogs === "yes" || cat.compatibility?.includes("dogs")) {
      score += 10;
      reasons.push({ key: "matching.reason_dogsOk", positive: true, weight: 10 });
    } else if (bp?.sociabilityDogs === "no") {
      score -= 15;
      reasons.push({ key: "matching.reason_dogsNo", positive: false, weight: 15 });
    }
  }

  // 5. ENERGY LEVEL match
  if (bp) {
    const energyMap = { calm: 1.5, moderate: 3, active: 4.5 };
    const preferred = energyMap[answers.energyPreference];
    const diff = Math.abs(bp.energyLevel - preferred);
    if (diff <= 1) {
      score += 10;
      reasons.push({ key: "matching.reason_energyMatch", positive: true, weight: 10 });
    } else if (diff >= 3) {
      score -= 10;
      reasons.push({ key: "matching.reason_energyMismatch", positive: false, weight: 10 });
    }
  }

  // 6. LIVING SPACE vs energy
  if (bp) {
    if (answers.livingSpace === "small" && bp.energyLevel >= 4) {
      score -= 8;
      reasons.push({ key: "matching.reason_spaceSmall", positive: false, weight: 8 });
    } else if (answers.livingSpace === "large" && bp.energyLevel >= 4) {
      score += 6;
      reasons.push({ key: "matching.reason_spaceLarge", positive: true, weight: 6 });
    }
  }

  // 7. EXPERIENCE LEVEL + health/behavioral complexity
  const isComplex = cat.healthStatus === "chronic" || cat.heartAdoption?.isHeartAdoption;
  if (isComplex) {
    if (answers.experienceLevel === "expert") {
      score += 10;
      reasons.push({ key: "matching.reason_expertForComplex", positive: true, weight: 10 });
    } else if (answers.experienceLevel === "first") {
      score -= 12;
      reasons.push({ key: "matching.reason_firstTimerComplex", positive: false, weight: 12 });
    }
  } else if (answers.experienceLevel === "first") {
    // Simple healthy cat — good for first timers
    if (bp && bp.sociabilityHumans >= 4 && cat.healthStatus === "healthy") {
      score += 8;
      reasons.push({ key: "matching.reason_easyFirstCat", positive: true, weight: 8 });
    }
  }

  // 8. BUDGET vs health needs
  if (cat.healthStatus === "chronic" && answers.monthlyBudget === "low") {
    score -= 10;
    reasons.push({ key: "matching.reason_budgetLow", positive: false, weight: 10 });
  } else if (cat.healthStatus === "chronic" && answers.monthlyBudget === "high") {
    score += 5;
    reasons.push({ key: "matching.reason_budgetOk", positive: true, weight: 5 });
  }

  // 9. NOISE PREFERENCE
  if (bp) {
    if (answers.noisePreference === "silent" && bp.vocality === "vocal") {
      score -= 8;
      reasons.push({ key: "matching.reason_tooVocal", positive: false, weight: 8 });
    } else if (answers.noisePreference === "silent" && bp.vocality === "silent") {
      score += 6;
      reasons.push({ key: "matching.reason_quietMatch", positive: true, weight: 6 });
    }
  }

  // 10. SPECIAL SITUATIONS
  if (answers.specialSituation === "pregnancy") {
    // Calm cats are better during pregnancy
    if (bp && bp.energyLevel <= 2) {
      score += 5;
      reasons.push({ key: "matching.reason_calmForPregnancy", positive: true, weight: 5 });
    }
  }
  if (answers.specialSituation === "elderly") {
    if (cat.compatibility?.includes("elderly") || (bp && bp.energyLevel <= 2)) {
      score += 10;
      reasons.push({ key: "matching.reason_elderlyMatch", positive: true, weight: 10 });
    }
  }

  // 11. AFFECTION bonus
  if (bp) {
    if (bp.affectionStyle === "seeks") {
      score += 3;
      reasons.push({ key: "matching.reason_affectionate", positive: true, weight: 3 });
    }
  }

  // Clamp
  score = Math.max(5, Math.min(98, score));

  // Sort reasons by weight
  reasons.sort((a, b) => b.weight - a.weight);

  return { cat, score, reasons: reasons.slice(0, 5) };
}

/**
 * Match all available cats and return sorted results.
 */
export function matchAllCats(answers: LifestyleAnswers, cats: CatProfile[]): MatchResult[] {
  const adoptable = cats.filter((c) => c.status === "adoption");
  return adoptable
    .map((cat) => calculateMatch(answers, cat))
    .sort((a, b) => b.score - a.score);
}

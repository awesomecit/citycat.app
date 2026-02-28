import type { CatProfile } from "@/api/types";

/**
 * Detects if a cat qualifies for "Adozione del Cuore" based on health/behavioral triggers.
 * Returns an array of reason keys (i18n) or empty if no triggers found.
 */
export function detectHeartAdoptionTriggers(cat: CatProfile): string[] {
  const reasons: string[] = [];

  // Elderly cat (8+ years)
  if (cat.age >= 8) reasons.push("heartAdoption.reason_elderly");

  // Chronic health condition
  if (cat.healthStatus === "chronic") reasons.push("heartAdoption.reason_chronic");

  // FIV/FeLV mentioned in health notes
  if (cat.healthNotes) {
    const notes = cat.healthNotes.toLowerCase();
    if (notes.includes("fiv") || notes.includes("felv") || notes.includes("fip")) {
      reasons.push("heartAdoption.reason_fiv");
    }
  }

  // Long shelter stay (> 6 months from arrival)
  if (cat.arrivalDate) {
    const arrival = new Date(cat.arrivalDate);
    const now = new Date();
    const months = (now.getFullYear() - arrival.getFullYear()) * 12 + (now.getMonth() - arrival.getMonth());
    if (months >= 6) reasons.push("heartAdoption.reason_longStay");
  }

  // Behavioral issues: fears, low sociability
  const bp = cat.behavioralProfile;
  if (bp) {
    if (bp.sociabilityHumans <= 2) reasons.push("heartAdoption.reason_shy");
    if (bp.specialBehaviors.includes("fears_loud_noises") && bp.specialBehaviors.includes("fears_strangers")) {
      reasons.push("heartAdoption.reason_fearful");
    }
  }

  return reasons;
}

/**
 * Check if a cat is flagged as heart adoption (manually or auto-suggested).
 */
export function isHeartAdoption(cat: CatProfile): boolean {
  return cat.heartAdoption?.isHeartAdoption === true;
}

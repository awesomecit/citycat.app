/**
 * Mock Beta Access Codes
 * 
 * 50 posti beta distribuiti proporzionalmente per tipologia di ruolo:
 * - Adottante:          15 codici (30%)
 * - Ente/Shelter:        8 codici (16%)
 * - Volontario:          7 codici (14%)
 * - Comune/ASL:          4 codici  (8%)
 * - Veterinario:         4 codici  (8%)
 * - Comportamentalista:  3 codici  (6%)
 * - Cat Sitter:          3 codici  (6%)
 * - Staffettista:        2 codici  (4%)
 * - Famiglia Stallo:     2 codici  (4%)
 * - Allevatore:          1 codice  (2%)
 * - Artigiano:           1 codice  (2%)
 * 
 * Formato: 5 caratteri alfanumerici maiuscoli (A-Z, 0-9)
 */

import type { UserRole } from "./roles";

export interface BetaCode {
  code: string;
  role: UserRole;
  label: string;
  used: boolean;
}

export const BETA_CODES: BetaCode[] = [
  // Adottante — 15 codici (30%)
  { code: "AX7K2", role: "adopter", label: "Adottante", used: false },
  { code: "BM3P9", role: "adopter", label: "Adottante", used: false },
  { code: "CT5W1", role: "adopter", label: "Adottante", used: false },
  { code: "DH8N4", role: "adopter", label: "Adottante", used: false },
  { code: "EJ2R6", role: "adopter", label: "Adottante", used: false },
  { code: "FK9L3", role: "adopter", label: "Adottante", used: false },
  { code: "GV4T8", role: "adopter", label: "Adottante", used: false },
  { code: "HW6Q5", role: "adopter", label: "Adottante", used: false },
  { code: "JN1Y7", role: "adopter", label: "Adottante", used: false },
  { code: "KP8D2", role: "adopter", label: "Adottante", used: false },
  { code: "LR3F9", role: "adopter", label: "Adottante", used: false },
  { code: "MS5G1", role: "adopter", label: "Adottante", used: false },
  { code: "NX7H4", role: "adopter", label: "Adottante", used: false },
  { code: "PW2J6", role: "adopter", label: "Adottante", used: false },
  { code: "QZ9K8", role: "adopter", label: "Adottante", used: false },

  // Ente/Shelter — 8 codici (16%)
  { code: "SA4M3", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "TB6N7", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "UC1P2", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "VD8Q5", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "WE3R9", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "XF5S1", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "YG7T4", role: "shelter", label: "Ente/Shelter", used: false },
  { code: "ZH2U6", role: "shelter", label: "Ente/Shelter", used: false },

  // Volontario — 7 codici (14%)
  { code: "VA9W8", role: "volunteer", label: "Volontario", used: false },
  { code: "VB3X1", role: "volunteer", label: "Volontario", used: false },
  { code: "VC6Y5", role: "volunteer", label: "Volontario", used: false },
  { code: "VD1Z3", role: "volunteer", label: "Volontario", used: false },
  { code: "VE4A7", role: "volunteer", label: "Volontario", used: false },
  { code: "VF8B2", role: "volunteer", label: "Volontario", used: false },
  { code: "VG5C9", role: "volunteer", label: "Volontario", used: false },

  // Comune/ASL — 4 codici (8%)
  { code: "MA7D4", role: "municipality", label: "Comune/ASL", used: false },
  { code: "MB2E6", role: "municipality", label: "Comune/ASL", used: false },
  { code: "MC9F1", role: "municipality", label: "Comune/ASL", used: false },
  { code: "MD4G8", role: "municipality", label: "Comune/ASL", used: false },

  // Veterinario — 4 codici (8%)
  { code: "VT6H3", role: "veterinarian", label: "Veterinario", used: false },
  { code: "VT1J7", role: "veterinarian", label: "Veterinario", used: false },
  { code: "VT8K2", role: "veterinarian", label: "Veterinario", used: false },
  { code: "VT3L5", role: "veterinarian", label: "Veterinario", used: false },

  // Comportamentalista — 3 codici (6%)
  { code: "CP5M9", role: "behaviorist", label: "Comportamentalista", used: false },
  { code: "CP2N4", role: "behaviorist", label: "Comportamentalista", used: false },
  { code: "CP7P1", role: "behaviorist", label: "Comportamentalista", used: false },

  // Cat Sitter — 3 codici (6%)
  { code: "CS9Q6", role: "catSitter", label: "Cat Sitter", used: false },
  { code: "CS4R8", role: "catSitter", label: "Cat Sitter", used: false },
  { code: "CS1S3", role: "catSitter", label: "Cat Sitter", used: false },

  // Staffettista — 2 codici (4%)
  { code: "RD6T7", role: "relayDriver", label: "Staffettista", used: false },
  { code: "RD2U2", role: "relayDriver", label: "Staffettista", used: false },

  // Famiglia Stallo — 2 codici (4%)
  { code: "FS8V5", role: "fosterFamily", label: "Famiglia Stallo", used: false },
  { code: "FS3W9", role: "fosterFamily", label: "Famiglia Stallo", used: false },

  // Allevatore — 1 codice (2%)
  { code: "BR5X1", role: "breeder", label: "Allevatore", used: false },

  // Artigiano — 1 codice (2%)
  { code: "AR7Y4", role: "artisan", label: "Artigiano", used: false },
];

/**
 * Validates a beta code and returns the matching entry if found.
 * Case-insensitive comparison.
 */
export function validateBetaCode(input: string): BetaCode | null {
  const normalized = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized.length !== 5) return null;
  return BETA_CODES.find((bc) => bc.code === normalized) ?? null;
}

/**
 * Returns summary stats for display.
 */
export function getBetaStats() {
  const byRole = new Map<string, { total: number; used: number }>();
  for (const bc of BETA_CODES) {
    const entry = byRole.get(bc.label) ?? { total: 0, used: 0 };
    entry.total++;
    if (bc.used) entry.used++;
    byRole.set(bc.label, entry);
  }
  return {
    total: BETA_CODES.length,
    used: BETA_CODES.filter((b) => b.used).length,
    byRole: Object.fromEntries(byRole),
  };
}

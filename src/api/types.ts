// API response & entity contracts

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type CatStatus = "owned" | "adoption" | "foster" | "sheltered";

export type CatCompatibility = "cats" | "dogs" | "children" | "elderly";
export type CatPersonality = "playful" | "calm" | "shy" | "independent" | "affectionate" | "curious";
export type CatHealthStatus = "healthy" | "treatment" | "chronic" | "recovery";

export type TriState = "yes" | "no" | "untested";
export type Vocality = "silent" | "normal" | "vocal";
export type AffectionStyle = "avoids" | "accepts" | "seeks";

export type SpecialBehavior =
  | "hunts_objects" | "follows_everywhere" | "sleeps_nearby"
  | "own_bowl_only" | "fears_loud_noises" | "fears_strangers"
  | "private_litter_only" | "marks_territory";

export interface CatBehavioralProfile {
  sociabilityHumans: number;      // 1-5
  sociabilityCats: number;        // 1-5
  sociabilityChildren: TriState;
  sociabilityDogs: TriState;
  energyLevel: number;            // 1-5
  aloneToleranceHours: number;    // 0-10
  vocality: Vocality;
  affectionStyle: AffectionStyle;
  specialBehaviors: SpecialBehavior[];
  compiledBy?: string;
  compiledAt?: string;
  source?: "shelter" | "volunteer" | "system";
}

export interface HeartAdoptionData {
  isHeartAdoption: boolean;
  narrative?: string;           // story written by volunteer/shelter
  challenges?: string;          // why this cat needs patience
  lookingFor?: string;          // what kind of adopter it needs
  smallVictories?: string;      // progress already made
  autoSuggested?: boolean;      // system detected triggers
  suggestedReasons?: string[];  // auto-detected reasons
}

export interface CatProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  photoUrl?: string;
  ownerId: string;
  status: CatStatus;
  description?: string;
  gender?: "male" | "female";
  vaccinated?: boolean;
  // Extended fields for shelter management
  sterilized?: boolean;
  microchipped?: boolean;
  microchipId?: string;
  healthStatus?: CatHealthStatus;
  healthNotes?: string;
  personality?: CatPersonality[];
  compatibility?: CatCompatibility[];
  backstory?: string;
  weight?: number; // kg
  color?: string;
  arrivalDate?: string;
  shelterName?: string;
  behavioralProfile?: CatBehavioralProfile;
  heartAdoption?: HeartAdoptionData;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface LocationArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

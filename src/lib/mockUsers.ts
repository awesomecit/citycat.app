import type { UserRole } from "./roles";

export interface MockUser {
  email: string;
  password: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
  avatarUrl?: string;
  zone?: string;        // geographic zone of interest
  bio?: string;
}

export const mockUsers: MockUser[] = [
  { email: "mario@citycat.it", password: "gatto123", name: "Mario Rossi", roles: ["adopter"], activeRole: "adopter", zone: "Centro Storico, Roma", bio: "Amante dei gatti, cerco il mio primo compagno felino." },
  { email: "luna@citycat.it", password: "micio456", name: "Luna Bianchi", roles: ["volunteer", "fosterFamily"], activeRole: "volunteer", zone: "Trastevere, Roma" },
  { email: "rifugio@citycat.it", password: "shelter1", name: "Rifugio Felino Roma", roles: ["shelter"], activeRole: "shelter", zone: "Roma" },
  { email: "comune@citycat.it", password: "comune1", name: "Comune di Roma", roles: ["municipality"], activeRole: "municipality", zone: "Roma" },
  { email: "vet@citycat.it", password: "vet123", name: "Dr. Marco Verdi", roles: ["veterinarian"], activeRole: "veterinarian", zone: "Roma Nord" },
  { email: "comporta@citycat.it", password: "brain123", name: "Dr.ssa Sara Neri", roles: ["behaviorist"], activeRole: "behaviorist" },
  { email: "sitter@citycat.it", password: "sitter1", name: "Giulia Gatti", roles: ["catSitter"], activeRole: "catSitter", zone: "Prati, Roma" },
  { email: "shop@citycat.it", password: "shop123", name: "PetShop Felix", roles: ["artisan"], activeRole: "artisan" },
  { email: "admin@citycat.it", password: "admin123", name: "Admin CC", roles: ["admin"], activeRole: "admin" },
  { email: "test@test.com", password: "password", name: "Test User", roles: ["adopter"], activeRole: "adopter" },
];

export const findUser = (email: string, password: string): MockUser | undefined =>
  mockUsers.find((u) => u.email === email && u.password === password);

export const emailExists = (email: string): boolean =>
  mockUsers.some((u) => u.email === email);

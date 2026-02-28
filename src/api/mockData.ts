import type { CatProfile, UserProfile, Notification, LocationArea } from "./types";

export const mockCats: CatProfile[] = [
  { id: "1", name: "Micio", breed: "Europeo", age: 3, ownerId: "u1", status: "owned", gender: "male", vaccinated: true, description: "Gatto giocherellone, ama le coccole e il cibo umido." },
  { id: "2", name: "Luna", breed: "Persiano", age: 5, ownerId: "u1", status: "owned", gender: "female", vaccinated: true, description: "Elegante e tranquilla, perfetta compagna da divano." },
  { id: "3", name: "Whiskers", breed: "Maine Coon", age: 2, ownerId: "u2", status: "adoption", gender: "male", vaccinated: false, description: "Cucciolo energico cerca una famiglia amorevole." },
  { id: "4", name: "Nala", breed: "Siamese", age: 1, ownerId: "u3", status: "adoption", gender: "female", vaccinated: true, description: "Dolce e socievole, va d'accordo con altri animali." },
  { id: "5", name: "Romeo", breed: "Certosino", age: 4, ownerId: "u3", status: "adoption", gender: "male", vaccinated: true, description: "Indipendente ma affettuoso, cerca un giardino." },
];

export const mockUser: UserProfile = {
  id: "u1",
  name: "Mario Rossi",
  email: "mario@citycat.it",
  createdAt: "2025-01-15T10:00:00Z",
};

export const mockNotifications: Notification[] = [
  { id: "n1", title: "Benvenuto!", body: "Il tuo account è stato creato.", read: false, createdAt: "2026-02-22T09:00:00Z" },
  { id: "n2", title: "Nuovo evento", body: "Cat Meetup nel tuo quartiere.", read: true, createdAt: "2026-02-21T14:00:00Z" },
];

export const mockLocations: LocationArea[] = [
  { id: "l1", name: "Centro Storico", lat: 41.9028, lng: 12.4964, radius: 2 },
  { id: "l2", name: "Trastevere", lat: 41.8892, lng: 12.4700, radius: 1.5 },
];

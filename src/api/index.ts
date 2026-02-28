import { apiRequest } from "./client";
import type { CatProfile, UserProfile, Notification, LocationArea } from "./types";
import { mockCats, mockUser, mockNotifications, mockLocations } from "./mockData";

export const api = {
  cats: {
    list: () =>
      apiRequest<CatProfile[]>({ method: "GET", url: "/cats" }, mockCats),
    get: (id: string) =>
      apiRequest<CatProfile>({ method: "GET", url: `/cats/${id}` }, mockCats[0]),
  },

  user: {
    me: () =>
      apiRequest<UserProfile>({ method: "GET", url: "/user/me" }, mockUser),
  },

  notifications: {
    list: () =>
      apiRequest<Notification[]>({ method: "GET", url: "/notifications" }, mockNotifications),
  },

  locations: {
    list: () =>
      apiRequest<LocationArea[]>({ method: "GET", url: "/locations" }, mockLocations),
  },
} as const;

export type { CatProfile, UserProfile, Notification, LocationArea } from "./types";

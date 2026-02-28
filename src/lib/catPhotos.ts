// Cat photo imports — mapped by cat ID
import catMicio from "@/assets/cats/cat-micio.jpg";
import catLuna from "@/assets/cats/cat-luna.jpg";
import catWhiskers from "@/assets/cats/cat-whiskers.jpg";
import catNala from "@/assets/cats/cat-nala.jpg";
import catRomeo from "@/assets/cats/cat-romeo.jpg";

export const CAT_PHOTOS: Record<string, string> = {
  "1": catMicio,
  "2": catLuna,
  "3": catWhiskers,
  "4": catNala,
  "5": catRomeo,
};

export const getCatPhoto = (id: string): string | undefined => CAT_PHOTOS[id];

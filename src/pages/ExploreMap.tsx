import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useMunicipalityStore } from "@/stores/municipalityStore";
import { mockCats } from "@/api/mockData";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Cat, Home, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getCatPhoto } from "@/lib/catPhotos";

interface MapPin_ {
  id: string;
  type: "cat" | "shelter" | "colony";
  name: string;
  label: string;
  left: string;
  top: string;
  color: string;
}

const ExploreMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const { colonies } = useMunicipalityStore();
  const adoptionCats = mockCats.filter((c) => c.status === "adoption");

  const [selected, setSelected] = useState<MapPin_ | null>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  // Build pins from cats + colonies + mock shelters
  const pins: MapPin_[] = [
    ...adoptionCats.map((cat, i) => ({
      id: `cat-${cat.id}`,
      type: "cat" as const,
      name: cat.name,
      label: `${cat.breed} · ${cat.age}a`,
      left: `${20 + i * 18}%`,
      top: `${25 + (i % 3) * 20}%`,
      color: "15 85% 55%",
    })),
    ...colonies.slice(0, 3).map((c, i) => ({
      id: `colony-${c.id}`,
      type: "colony" as const,
      name: c.name,
      label: `${c.catCount} ${t("municipality.cats")}`,
      left: `${15 + i * 25}%`,
      top: `${55 + (i % 2) * 15}%`,
      color: "142 60% 45%",
    })),
    {
      id: "shelter-1",
      type: "shelter",
      name: "Rifugio Felino Roma",
      label: t("exploreMap.shelter"),
      left: "65%",
      top: "30%",
      color: "25 85% 55%",
    },
    {
      id: "shelter-2",
      type: "shelter",
      name: "Gattile Municipale",
      label: t("exploreMap.shelter"),
      left: "40%",
      top: "75%",
      color: "25 85% 55%",
    },
  ];

  const selectedCat = selected?.type === "cat"
    ? adoptionCats.find((c) => `cat-${c.id}` === selected.id)
    : null;

  const pinIcon = (type: string) => {
    if (type === "cat") return Cat;
    if (type === "shelter") return Home;
    return MapPin;
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("exploreMap.title")} />
        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* Zone indicator */}
          {(user as any).zone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{t("exploreMap.nearYou", { zone: (user as any).zone })}</span>
            </div>
          )}

          {/* Map */}
          <Card className="relative overflow-hidden">
            <div className="relative h-72 bg-accent/30 flex items-center justify-center">
              {/* Grid */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div key={`h${i}`} className="absolute border-b border-foreground/20 w-full" style={{ top: `${(i + 1) * 12.5}%` }} />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={`v${i}`} className="absolute border-r border-foreground/20 h-full" style={{ left: `${(i + 1) * 12.5}%` }} />
                ))}
              </div>

              {/* Pins */}
              {pins.map((pin) => {
                const Icon = pinIcon(pin.type);
                const isSelected = selected?.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    className={`absolute transition-transform ${isSelected ? "scale-125 z-10" : "hover:scale-110"}`}
                    style={{ left: pin.left, top: pin.top }}
                    onClick={() => setSelected(isSelected ? null : pin)}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full shadow-md"
                        style={{ backgroundColor: `hsl(${pin.color})` }}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="mt-0.5 rounded-full bg-card px-1.5 py-0.5 text-[9px] font-bold shadow-sm text-foreground line-clamp-1 max-w-[60px]">
                        {pin.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 border-t bg-card p-2.5">
              {[
                { label: t("exploreMap.catsLegend"), color: "15 85% 55%", icon: Cat },
                { label: t("exploreMap.sheltersLegend"), color: "25 85% 55%", icon: Home },
                { label: t("exploreMap.coloniesLegend"), color: "142 60% 45%", icon: MapPin },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `hsl(${l.color})` }} />
                  {l.label}
                </div>
              ))}
            </div>
          </Card>

          {/* Selected detail */}
          {selected && (
            <Card className="animate-in slide-in-from-bottom-2">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {selectedCat ? (
                    <img
                      src={getCatPhoto(selectedCat.name)}
                      alt={selectedCat.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `hsl(${selected.color} / 0.12)` }}
                    >
                      {(() => { const Icon = pinIcon(selected.type); return <Icon className="h-6 w-6" style={{ color: `hsl(${selected.color})` }} />; })()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{selected.name}</h3>
                    <p className="text-xs text-muted-foreground">{selected.label}</p>
                    {selectedCat && (
                      <button
                        onClick={() => navigate(`/cats/${selectedCat.id}`)}
                        className="mt-2 flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm"
                      >
                        <Heart className="h-3 w-3" /> {t("exploreMap.viewCat")}
                      </button>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {selected.type === "cat" ? t("exploreMap.adoption") : selected.type === "shelter" ? t("exploreMap.shelter") : t("exploreMap.colony")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick list of adoption cats */}
          <h2 className="text-sm font-bold text-foreground mt-2">{t("exploreMap.nearbyAdoption")}</h2>
          <div className="space-y-2">
            {adoptionCats.map((cat) => (
              <Card
                key={cat.id}
                className="cursor-pointer transition-colors hover:bg-secondary/30"
                onClick={() => navigate(`/cats/${cat.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <img src={getCatPhoto(cat.name)} alt={cat.name} className="h-11 w-11 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.breed} · {cat.age} {t("cats.age", { count: cat.age })}</p>
                  </div>
                  <Badge className="text-[10px] bg-primary/10 text-primary">{t("cats.adoptionBadge")}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default ExploreMap;
